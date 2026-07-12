from sqlalchemy.orm import Session
from typing import List

from backend.models.chart import CarbonTrend, EsgRadar, DepartmentScoresChart, TopEmitters
from backend.schemas.dashboard import CarbonTrendPoint, EsgRadarPoint, DepartmentScorePoint, TopEmitter


class ChartService:
    def __init__(self, db: Session):
        self.db = db

    def get_carbon_trend(self) -> List[CarbonTrendPoint]:
        data = self.db.query(CarbonTrend).all()
        if not data:
            return self._get_default_carbon_trend()
        return [CarbonTrendPoint(month=d.month, tco2=d.tco2) for d in data]

    def get_esg_radar(self) -> List[EsgRadarPoint]:
        data = self.db.query(EsgRadar).all()
        if not data:
            return self._get_default_esg_radar()
        return [EsgRadarPoint(axis=d.axis, score=d.score) for d in data]

    def get_department_scores(self) -> List[DepartmentScorePoint]:
        data = self.db.query(DepartmentScoresChart).all()
        if not data:
            return self._get_default_department_scores()
        return [DepartmentScorePoint(name=d.name, value=d.value) for d in data]

    def get_top_emitters(self) -> List[TopEmitter]:
        data = self.db.query(TopEmitters).all()
        if not data:
            return self._get_default_top_emitters()
        return [TopEmitter(site=d.site, tco2=d.tco2) for d in data]

    def _get_default_carbon_trend(self) -> List[CarbonTrendPoint]:
        return [
            CarbonTrendPoint(month="Jan", tco2=148),
            CarbonTrendPoint(month="Feb", tco2=142),
            CarbonTrendPoint(month="Mar", tco2=138),
            CarbonTrendPoint(month="Apr", tco2=135),
            CarbonTrendPoint(month="May", tco2=130),
            CarbonTrendPoint(month="Jun", tco2=124),
        ]

    def _get_default_esg_radar(self) -> List[EsgRadarPoint]:
        return [
            EsgRadarPoint(axis="Environment", score=88),
            EsgRadarPoint(axis="Social", score=92),
            EsgRadarPoint(axis="Governance", score=94),
            EsgRadarPoint(axis="Ethics", score=89),
            EsgRadarPoint(axis="Supply Chain", score=85),
        ]

    def _get_default_department_scores(self) -> List[DepartmentScorePoint]:
        return [
            DepartmentScorePoint(name="HR", value=92),
            DepartmentScorePoint(name="Finance", value=95),
            DepartmentScorePoint(name="IT", value=88),
            DepartmentScorePoint(name="Ops", value=79),
            DepartmentScorePoint(name="Mfg", value=71),
        ]

    def _get_default_top_emitters(self) -> List[TopEmitter]:
        return [
            TopEmitter(site="Chennai Plant", tco2=42),
            TopEmitter(site="Madurai Warehouse", tco2=28),
            TopEmitter(site="Coimbatore Factory", tco2=22),
            TopEmitter(site="Trichy Office", tco2=18),
        ]