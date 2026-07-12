from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from backend.database import Base


class FeedItem(Base):
    __tablename__ = "feed_items"

    id = Column(Integer, primary_key=True, index=True)
    feed_id = Column(String, unique=True, index=True, nullable=False)
    t = Column(String, nullable=False)
    text = Column(String, nullable=False)
    tag = Column(String, nullable=False)  # environment, social, governance, ai, carbon
    created_at = Column(DateTime(timezone=True), server_default=func.now())