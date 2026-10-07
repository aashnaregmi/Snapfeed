from sqlalchemy import Column, Integer, String, DateTime, Date
from datetime import datetime

from database.db import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, nullable=False)

    media_url = Column(String, nullable=False)

    media_type = Column(String, nullable=False)

    caption = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    dob = Column(Date, nullable=False)

    username = Column(String, unique=True, nullable=False, index=True)

    gender = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False, index=True)

    password = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
