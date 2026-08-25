from sqlalchemy import Column, Integer, String, DateTime
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
