from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from pathlib import Path
import shutil
from sqlalchemy.orm import Session

from backend.feed.schema import PostResponse
from database.db import Base, engine, SessionLocal
from database.model import Post
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()


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


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# Feed
# =========================


@app.get("/posts", response_model=list[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()

    return posts


@app.post("/upload", response_model=PostResponse)
async def upload_media(
    username: str = Form(...),
    caption: str | None = Form(None),
    file: UploadFile = File(...),
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


# @app.get("/files")
# async def get_files(filename: str | None = None):
#     files = []

#     for file in UPLOAD_DIR.iterdir():
#         if file.is_file():
#             if filename is not None and file.name != filename:
#                 continue

#             files.append(
#                 {
#                     "filename": file.name,
#                     "url": f"/files/{file.name}",
#                 }
#             )

#     if filename is not None and not files:
#         raise HTTPException(status_code=404, detail="File not found")

#     return files
