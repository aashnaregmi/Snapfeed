from pydantic import BaseModel
from datetime import datetime


class PostResponse(BaseModel):
    id: int
    username: str
    media_url: str
    media_type: str
    caption: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class RegisterRequest(BaseModel):
    username: str
    password: str
