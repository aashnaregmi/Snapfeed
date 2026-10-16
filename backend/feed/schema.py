from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import date, datetime
import re


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
    username: str = Field(min_length=3, max_length=30, pattern=r"^[a-z_][a-z0-9_]*$")
    gender: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
        if not re.match(pattern, value):
            raise ValueError("Password does not match the required pattern")

        return value


class UpdateProfileRequest(BaseModel):
    bio: str = Field(default="", max_length=160)
