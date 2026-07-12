from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from backend.database import Base


class DepartmentScore(Base):
    __tablename__ = "department_scores"

    id = Column(Integer, primary_key=True, index=True)
    dept_id = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False)
    esg = Column(Integer, nullable=False)
    carbon = Column(String, nullable=False)  # low, medium, high
    csr = Column(Integer, nullable=False)
    governance = Column(Integer, nullable=False)
    confidence = Column(Integer, nullable=False)
    risk = Column(String, nullable=False)  # low, medium, high
    status = Column(String, nullable=False)  # excellent, good, watch, critical
    created_at = Column(DateTime(timezone=True), server_default=func.now())