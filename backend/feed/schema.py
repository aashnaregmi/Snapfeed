from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime


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
    name: str
    dob: date
    username: str
    gender: str
    email: EmailStr
    password: str
    confirm_password: str


class UpdateProfileRequest(BaseModel):
    bio: str = Field(default="", max_length=160)
