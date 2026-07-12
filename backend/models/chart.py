from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from backend.database import Base


class CarbonTrend(Base):
    __tablename__ = "carbon_trend"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, nullable=False)
    tco2 = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class EsgRadar(Base):
    __tablename__ = "esg_radar"

    id = Column(Integer, primary_key=True, index=True)
    axis = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DepartmentScoresChart(Base):
    __tablename__ = "department_scores_chart"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    value = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TopEmitters(Base):
    __tablename__ = "top_emitters"

    id = Column(Integer, primary_key=True, index=True)
    site = Column(String, nullable=False)
    tco2 = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())