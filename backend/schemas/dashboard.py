from typing import Literal
from pydantic import BaseModel


class KPIData(BaseModel):
    overall_score: dict
    carbon: dict
    ai_confidence: dict
    compliance_issues: dict
    csr_participation: dict
    challenges_active: dict


class DepartmentRow(BaseModel):
    id: str
    department: str
    esg: int
    carbon: Literal["low", "medium", "high"]
    csr: int
    governance: int
    confidence: int
    risk: Literal["low", "medium", "high"]
    status: Literal["excellent", "good", "watch", "critical"]


class Facility(BaseModel):
    id: str
    name: str
    district: str
    lat: float
    lng: float
    status: Literal["good", "watch", "critical"]
    energy: int
    water: int
    carbon: int
    employees: int
    waste: int
    risk: Literal["low", "medium", "high"]


class FeedItem(BaseModel):
    id: str
    t: str
    text: str
    tag: Literal["environment", "social", "governance", "ai", "carbon"]


class CarbonTrendPoint(BaseModel):
    month: str
    tco2: int


class EsgRadarPoint(BaseModel):
    axis: str
    score: int


class DepartmentScorePoint(BaseModel):
    name: str
    value: int


class TopEmitter(BaseModel):
    site: str
    tco2: int


class AIRecommendation(BaseModel):
    id: str
    title: str
    impact: str
    esgBoost: str


class EnvironmentCase(BaseModel):
    id: str
    ref: str
    title: str
    district: str
    status: Literal["Active", "Review", "Closed", "Watch"]
    severity: Literal["low", "medium", "high", "critical"]
    aiConfidence: int
    flagged: bool
    officer: str
    opened: str
    type: str
    site: str