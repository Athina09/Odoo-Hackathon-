from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from backend.database import Base


class EnvironmentCase(Base):
    __tablename__ = "environment_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, unique=True, index=True, nullable=False)
    ref = Column(String, nullable=False)
    title = Column(String, nullable=False)
    district = Column(String, nullable=False)
    status = Column(String, nullable=False)  # Active, Review, Closed, Watch
    severity = Column(String, nullable=False)  # low, medium, high, critical
    ai_confidence = Column(Integer, nullable=False)
    flagged = Column(Integer, nullable=False)  # 0 or 1
    officer = Column(String, nullable=False)
    opened = Column(String, nullable=False)
    type = Column(String, nullable=False)
    site = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())