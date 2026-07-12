from sqlalchemy.orm import Session
from typing import List

from backend.models.environment_case import EnvironmentCase
from backend.schemas.dashboard import EnvironmentCase as EnvCaseSchema


class EnvironmentCaseService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_cases(self) -> List[EnvCaseSchema]:
        cases = self.db.query(EnvironmentCase).all()
        if not cases:
            return self._get_default_cases()
        return [
            EnvCaseSchema(
                id=c.case_id,
                ref=c.ref,
                title=c.title,
                district=c.district,
                status=c.status,
                severity=c.severity,
                aiConfidence=c.ai_confidence,
                flagged=bool(c.flagged),
                officer=c.officer,
                opened=c.opened,
                type=c.type,
                site=c.site,
            )
            for c in cases
        ]

    def _get_default_cases(self) -> List[EnvCaseSchema]:
        return [
            EnvCaseSchema(id="ES-101", ref="ENV/2026/CHN/0042", title="Chennai Plant Carbon Overrun", district="Chennai", status="Active", severity="critical", aiConfidence=94, flagged=True, officer="M. Priya", opened="2026-05-10", type="Carbon", site="Chennai Plant"),
            EnvCaseSchema(id="ES-102", ref="ENV/2026/MDU/0018", title="Madurai Warehouse Waste Breach", district="Madurai", status="Active", severity="critical", aiConfidence=88, flagged=True, officer="R. Kumar", opened="2026-05-12", type="Waste", site="Madurai Warehouse"),
            EnvCaseSchema(id="ES-103", ref="ENV/2026/CBE/0033", title="Coimbatore Energy Audit Failure", district="Coimbatore", status="Review", severity="high", aiConfidence=72, flagged=True, officer="S. Anand", opened="2026-05-14", type="Energy", site="Coimbatore Factory"),
            EnvCaseSchema(id="ES-104", ref="ENV/2026/SLM/0012", title="Salem Scope 2 Reporting Gap", district="Salem", status="Active", severity="medium", aiConfidence=58, flagged=False, officer="K. Devi", opened="2026-05-03", type="Reporting", site="Salem Unit"),
            EnvCaseSchema(id="ES-105", ref="ENV/2026/TRY/0029", title="Trichy Water Usage Anomaly", district="Trichy", status="Active", severity="high", aiConfidence=83, flagged=True, officer="A. Ramesh", opened="2026-05-04", type="Water", site="Trichy Office"),
            EnvCaseSchema(id="ES-106", ref="ENV/2026/TIR/0007", title="Tirunelveli Solar Offset Delay", district="Tirunelveli", status="Watch", severity="medium", aiConfidence=41, flagged=False, officer="D. Vinod", opened="2026-03-19", type="Renewable", site="Tirunelveli Site"),
            EnvCaseSchema(id="ES-107", ref="ENV/2026/VEL/0051", title="Vellore Emissions Spike", district="Vellore", status="Active", severity="critical", aiConfidence=79, flagged=True, officer="S. Hari", opened="2026-05-06", type="Emissions", site="Vellore Lab"),
            EnvCaseSchema(id="ES-108", ref="ENV/2026/KNY/0002", title="Kanyakumari Plastic Waste Audit", district="Kanyakumari", status="Review", severity="low", aiConfidence=33, flagged=False, officer="L. Thomas", opened="2026-05-07", type="Waste", site="Kanyakumari Depot"),
        ]