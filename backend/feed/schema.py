from pydantic import BaseModel


class PostResponse(BaseModel):
    id: int
    username: str
    media_url: str
    media_type: str
    caption: str | None = None
