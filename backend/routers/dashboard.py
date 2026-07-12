from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.services.kpi_service import KPIService
from backend.services.department_service import DepartmentService
from backend.services.facility_service import FacilityService
from backend.services.feed_service import FeedService
from backend.services.chart_service import ChartService
from backend.services.recommendation_service import RecommendationService
from backend.services.environment_case_service import EnvironmentCaseService
from backend.schemas.dashboard import (
    KPIData, DepartmentRow, Facility, FeedItem,
    CarbonTrendPoint, EsgRadarPoint, DepartmentScorePoint, TopEmitter,
    AIRecommendation, EnvironmentCase
)

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


def get_kpi_service(db: Session = Depends(get_db)) -> KPIService:
    return KPIService(db)


def get_department_service(db: Session = Depends(get_db)) -> DepartmentService:
    return DepartmentService(db)


def get_facility_service(db: Session = Depends(get_db)) -> FacilityService:
    return FacilityService(db)


def get_feed_service(db: Session = Depends(get_db)) -> FeedService:
    return FeedService(db)


def get_chart_service(db: Session = Depends(get_db)) -> ChartService:
    return ChartService(db)


def get_recommendation_service(db: Session = Depends(get_db)) -> RecommendationService:
    return RecommendationService(db)


def get_environment_case_service(db: Session = Depends(get_db)) -> EnvironmentCaseService:
    return EnvironmentCaseService(db)


@router.get("/kpis", response_model=KPIData)
def get_kpis(service: KPIService = Depends(get_kpi_service)):
    return service.get_latest_kpis()


@router.get("/departments", response_model=List[DepartmentRow])
def get_departments(service: DepartmentService = Depends(get_department_service)):
    return service.get_all_departments()


@router.get("/facilities", response_model=List[Facility])
def get_facilities(service: FacilityService = Depends(get_facility_service)):
    return service.get_all_facilities()


@router.get("/live-feed", response_model=List[FeedItem])
def get_live_feed(service: FeedService = Depends(get_feed_service)):
    return service.get_live_feed()


@router.get("/charts/carbon-trend", response_model=List[CarbonTrendPoint])
def get_carbon_trend(service: ChartService = Depends(get_chart_service)):
    return service.get_carbon_trend()


@router.get("/charts/esg-radar", response_model=List[EsgRadarPoint])
def get_esg_radar(service: ChartService = Depends(get_chart_service)):
    return service.get_esg_radar()


@router.get("/charts/department-scores", response_model=List[DepartmentScorePoint])
def get_department_scores(service: ChartService = Depends(get_chart_service)):
    return service.get_department_scores()


@router.get("/charts/top-emitters", response_model=List[TopEmitter])
def get_top_emitters(service: ChartService = Depends(get_chart_service)):
    return service.get_top_emitters()


@router.get("/ai-recommendations", response_model=List[AIRecommendation])
def get_ai_recommendations(service: RecommendationService = Depends(get_recommendation_service)):
    return service.get_ai_engine_recommendations()


@router.get("/environment-cases", response_model=List[EnvironmentCase])
def get_environment_cases(service: EnvironmentCaseService = Depends(get_environment_case_service)):
    return service.get_all_cases()