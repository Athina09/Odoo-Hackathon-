from sqlalchemy.orm import Session
from typing import List

from backend.models.department import DepartmentScore
from backend.schemas.dashboard import DepartmentRow


class DepartmentService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_departments(self) -> List[DepartmentRow]:
        departments = self.db.query(DepartmentScore).all()
        if not departments:
            return self._get_default_departments()
        return [
            DepartmentRow(
                id=d.dept_id,
                department=d.department,
                esg=d.esg,
                carbon=d.carbon,
                csr=d.csr,
                governance=d.governance,
                confidence=d.confidence,
                risk=d.risk,
                status=d.status,
            )
            for d in departments
        ]

    def _get_default_departments(self) -> List[DepartmentRow]:
        return [
            DepartmentRow(id="mfg", department="Manufacturing", esg=71, carbon="high", csr=68, governance=74, confidence=83, risk="high", status="watch"),
            DepartmentRow(id="hr", department="HR", esg=92, carbon="low", csr=94, governance=96, confidence=97, risk="low", status="excellent"),
            DepartmentRow(id="it", department="IT", esg=88, carbon="medium", csr=85, governance=90, confidence=91, risk="medium", status="good"),
            DepartmentRow(id="fin", department="Finance", esg=95, carbon="low", csr=93, governance=98, confidence=99, risk="low", status="excellent"),
            DepartmentRow(id="ops", department="Operations", esg=79, carbon="medium", csr=77, governance=82, confidence=86, risk="medium", status="good"),
            DepartmentRow(id="legal", department="Legal & Compliance", esg=90, carbon="low", csr=88, governance=97, confidence=95, risk="low", status="excellent"),
        ]