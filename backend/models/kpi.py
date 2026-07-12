from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from backend.database import Base


class KPISnapshot(Base):
    __tablename__ = "kpi_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    overall_score_value = Column(Integer, nullable=False)
    overall_score_label = Column(String, nullable=False)
    overall_score_trend = Column(String, nullable=False)
    carbon_value = Column(String, nullable=False)
    carbon_trend = Column(String, nullable=False)
    ai_confidence_value = Column(String, nullable=False)
    ai_confidence_sub = Column(String, nullable=False)
    compliance_issues_value = Column(Integer, nullable=False)
    compliance_issues_sub = Column(String, nullable=False)
    csr_participation_value = Column(String, nullable=False)
    csr_participation_trend = Column(String, nullable=False)
    challenges_active_value = Column(Integer, nullable=False)
    challenges_active_sub = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())