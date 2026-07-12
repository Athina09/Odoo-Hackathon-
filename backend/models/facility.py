from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from backend.database import Base


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    district = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    status = Column(String, nullable=False)  # good, watch, critical
    energy = Column(Integer, nullable=False)
    water = Column(Integer, nullable=False)
    carbon = Column(Integer, nullable=False)
    employees = Column(Integer, nullable=False)
    waste = Column(Integer, nullable=False)
    risk = Column(String, nullable=False)  # low, medium, high
    created_at = Column(DateTime(timezone=True), server_default=func.now())