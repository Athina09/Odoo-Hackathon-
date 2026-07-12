from sqlalchemy.orm import Session
from typing import Optional

from backend.models.kpi import KPISnapshot
from backend.schemas.dashboard import KPIData


class KPIService:
    def __init__(self, db: Session):
        self.db = db

    def get_latest_kpis(self) -> KPIData:
        latest = self.db.query(KPISnapshot).order_by(KPISnapshot.created_at.desc()).first()
        if not latest:
            return self._get_default_kpis()
        return KPIData(
            overall_score={
                "value": latest.overall_score_value,
                "label": latest.overall_score_label,
                "trend": latest.overall_score_trend,
            },
            carbon={
                "value": latest.carbon_value,
                "trend": latest.carbon_trend,
            },
            ai_confidence={
                "value": latest.ai_confidence_value,
                "sub": latest.ai_confidence_sub,
            },
            compliance_issues={
                "value": latest.compliance_issues_value,
                "sub": latest.compliance_issues_sub,
            },
            csr_participation={
                "value": latest.csr_participation_value,
                "trend": latest.csr_participation_trend,
            },
            challenges_active={
                "value": latest.challenges_active_value,
                "sub": latest.challenges_active_sub,
            },
        )

    def _get_default_kpis(self) -> KPIData:
        return KPIData(
            overall_score={"value": 91, "label": "Excellent", "trend": "↑ +4%"},
            carbon={"value": "124 tCO₂", "trend": "↓ 12%"},
            ai_confidence={"value": "94%", "sub": "Verified"},
            compliance_issues={"value": 4, "sub": "2 Critical"},
            csr_participation={"value": "87%", "trend": "↑ 8%"},
            challenges_active={"value": 18, "sub": "6 ending soon"},
        )