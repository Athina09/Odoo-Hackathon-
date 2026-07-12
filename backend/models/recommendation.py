from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from backend.database import Base


class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    rec_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    impact = Column(String, nullable=False)
    esg_boost = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())