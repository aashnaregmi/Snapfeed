import os
import cloudinary
import cloudinary.uploader

from datetime import datetime, timedelta, timezone

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException,
    Depends,
    Form,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from backend.feed.schema import PostResponse, RegisterRequest, UpdateProfileRequest
from database.db import Base, engine, SessionLocal
from database.model import Post, User

app = FastAPI()

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is required")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://snapfeed-seven.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
}

password_hash = PasswordHash.recommended()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# Register
# =========================


@app.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User)
        .filter((User.username == data.username) | (User.email == data.email))
        .first()
    )

    if existing_user:
        if existing_user.email == data.email:
            raise HTTPException(
                status_code=400,
                detail="Email already registered. Try logging in.",
            )

        if existing_user.username == data.username:
            raise HTTPException(
                status_code=400,
                detail="Username already used. Try a new username.",
            )

    if data.password != data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match",
        )

    hashed_password = password_hash.hash(data.password)

    new_user = User(
        name=data.name,
        dob=data.dob,
        username=data.username,
        gender=data.gender,
        email=data.email,
        password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Registration successful"}


# =========================
# JWT
# =========================


def create_token(data: dict):
    payload = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload["exp"] = expire

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# =========================
# Login
# =========================


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Not registered")

    password_correct = password_hash.verify(
        form_data.password,
        user.password,
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    access_token = create_token({"sub": user.username})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# =========================
# Current user
# =========================


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        username = payload.get("sub")

        if username is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

        return username

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )


# =========================
# Feed
# =========================


@app.get("/posts", response_model=list[PostResponse])
def get_posts(
    db: Session = Depends(get_db),
    username: str = Depends(get_current_user),
):
    posts = db.query(Post).order_by(Post.created_at.desc()).all()

    if not posts:
        raise HTTPException(status_code=404, detail="Posts not found")

    return posts


# =========================
# Upload to Cloudinary
# =========================


@app.post("/upload")
async def upload_post(
    caption: str | None = Form(None),
    file: UploadFile = File(...),
    username: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only image or video files are allowed",
        )

    required_settings = [
        os.getenv("CLOUDINARY_CLOUD_NAME"),
        os.getenv("CLOUDINARY_API_KEY"),
        os.getenv("CLOUDINARY_API_SECRET"),
    ]

    if not all(required_settings):
        raise HTTPException(
            status_code=500,
            detail="Cloudinary is not configured on the server",
        )

    media_type = "image" if file.content_type.startswith("image/") else "video"

    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder="snapfeed",
            resource_type=media_type,
        )
        media_url = result["secure_url"]

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Media upload failed. Please try again.",
        )

    finally:
        await file.close()

    new_post = Post(
        username=username,
        media_url=media_url,
        media_type=media_type,
        caption=caption,
    )

    try:
        db.add(new_post)
        db.commit()
        db.refresh(new_post)

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save the post",
        )

    return new_post


# =========================
# My uploads
# =========================


@app.get("/myuploads")
async def get_my_files(
    username: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    posts = (
        db.query(Post)
        .filter(Post.username == username)
        .order_by(Post.created_at.desc())
        .all()
    )

    if not posts:
        raise HTTPException(
            status_code=404,
            detail="You have not uploaded any files",
        )

    return [
        {
            "id": post.id,
            "filename": post.media_url.split("/")[-1],
            "url": post.media_url,
            "media_type": post.media_type,
            "caption": post.caption,
            "created_at": post.created_at,
        }
        for post in posts
    ]


# =========================
# My Profile
# =========================


@app.get("/me")
def get_my_profile(
    username: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user = db.query(User).filter(User.username == username).first()

    if current_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "name": current_user.name,
        "username": current_user.username,
        "email": current_user.email,
        "bio": current_user.bio or "",
    }


@app.patch("/me")
def update_my_profile(
    data: UpdateProfileRequest,
    username: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user = db.query(User).filter(User.username == username).first()

    if current_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    current_user.bio = data.bio.strip()

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "bio": current_user.bio or "",
    }
