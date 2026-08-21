from fastapi import FastAPI, UploadFile, File, HTTPException
from pathlib import Path
import shutil

from feed.demo import demo_posts
from feed.schema import PostResponse

app = FastAPI()


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
}

# =========================
# Feed
# =========================


@app.get("/posts", response_model=list[PostResponse])
def get_posts():
    return demo_posts


@app.post("/upload")
async def upload_media(
    id: int,
    username: str,
    file: UploadFile = File(...),
    caption: str | None = None,
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
    new_post = {
        "id": id,
        "username": username,
        "media_url": url,
        "media_type": media_type,
        "caption": caption,
    }

    # Add the new post to our temporary feed
    demo_posts.append(new_post)

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
