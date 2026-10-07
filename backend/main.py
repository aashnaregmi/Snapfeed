from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from pathlib import Path
import shutil
from sqlalchemy.orm import Session

from backend.feed.schema import PostResponse, RegisterRequest, ForgotPasswordRequest
from database.db import Base, engine, SessionLocal
from database.model import Post, User
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# for registation
from fastapi.security import OAuth2PasswordRequestForm
from pwdlib import PasswordHash

# for login

from fastapi.security import OAuth2PasswordRequestForm
from pwdlib import PasswordHash

# jwt
from jose import jwt
from datetime import datetime, timedelta, timezone

#  Import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

app = FastAPI()

SECRET_KEY = "mysecret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/files", StaticFiles(directory=str(UPLOAD_DIR)), name="files")

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
                status_code=400, detail="Email already registered. Try logging in."
            )
        if existing_user.username == data.username:
            raise HTTPException(
                status_code=400, detail="Username already used. Try a new username."
            )

    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

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
# Jwt generate
# =========================


def create_token(data: dict):
    payload = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    payload["exp"] = expire

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return token


# =========================
# Login
# =========================
@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Not registered")

    password_correct = password_hash.verify(form_data.password, user.password)

    if not password_correct:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_token({"sub": user.username})

    return {"access_token": access_token, "token_type": "bearer"}


# =========================
# get_current_user
# =========================
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        username = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return username

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# =========================
# Feed
# =========================


@app.get("/posts", response_model=list[PostResponse])
def get_posts(db: Session = Depends(get_db), username: str = Depends(get_current_user)):
    posts = db.query(Post).order_by(Post.created_at.desc()).all()

    if not posts:
        raise HTTPException(status_code=404, detail="Posts not found")

    return posts


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

    media_type = "image" if file.content_type.startswith("image/") else "video"

    file_path = UPLOAD_DIR / file.filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    url = f"/files/{file.filename}"

    # Create a new post
    new_post = Post(
        username=username,
        media_url=url,
        media_type=media_type,
        caption=caption,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


@app.get("/myuploads")
async def get_my_files(
    username: str = Depends(get_current_user), db: Session = Depends(get_db)
):
    posts = (
        db.query(Post)
        .filter(Post.username == username)
        .order_by(Post.created_at.desc())
        .all()
    )

    if not posts:
        raise HTTPException(status_code=404, detail="You have not uploaded any files")

    files = []

    for post in posts:
        files.append(
            {
                "id": post.id,
                "filename": post.media_url.split("/")[-1],
                "url": post.media_url,
                "media_type": post.media_type,
                "caption": post.caption,
                "created_at": post.created_at,
            }
        )

    return files


# @app.delete("/posts/{id}")
# async def delete_post(
#     id: int, username: str = Depends(get_current_user), db: Session = Depends(get_db)
# ):
#     post = db.query(Post).filter(Post.id == id, Post.username == username).first()

#     if not post:
#         raise HTTPException(status_code=404, detail="Post not found")

#     db.delete(post)
#     db.commit()


#     return {"message": "Post deleted successfully"}
@app.delete("/delete-all")
def delete_all_data(db: Session = Depends(get_db)):
    db.query(Post).delete()
    db.query(User).delete()
    db.commit()

    return {"message": "All data deleted successfully"}


# fogot pw
@app.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")

    return {"message": "Password reset request received"}
