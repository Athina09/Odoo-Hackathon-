from sqlalchemy.orm import Session
from typing import List

from backend.models.facility import Facility
from backend.schemas.dashboard import Facility as FacilitySchema


class FacilityService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_facilities(self) -> List[FacilitySchema]:
        facilities = self.db.query(Facility).all()
        if not facilities:
            return self._get_default_facilities()
        return [
            FacilitySchema(
                id=f.facility_id,
                name=f.name,
                district=f.district,
                lat=f.lat,
                lng=f.lng,
                status=f.status,
                energy=f.energy,
                water=f.water,
                carbon=f.carbon,
                employees=f.employees,
                waste=f.waste,
                risk=f.risk,
            )
            for f in facilities
        ]

    def _get_default_facilities(self) -> List[FacilitySchema]:
        return [
            FacilitySchema(id="chennai-plant", name="Chennai Plant", district="Chennai", lat=13.0827, lng=80.2707, status="critical", energy=91, water=88, carbon=94, employees=420, waste=82, risk="high"),
            FacilitySchema(id="coimbatore-factory", name="Coimbatore Factory", district="Coimbatore", lat=11.0168, lng=76.9558, status="good", energy=78, water=81, carbon=55, employees=310, waste=62, risk="low"),
            FacilitySchema(id="madurai-warehouse", name="Madurai Warehouse", district="Madurai", lat=9.9252, lng=78.1198, status="watch", energy=64, water=58, carbon=72, employees=180, waste=65, risk="medium"),
            FacilitySchema(id="salem-unit", name="Salem Unit", district="Salem", lat=11.6643, lng=78.146, status="good", energy=76, water=74, carbon=58, employees=145, waste=60, risk="low"),
            FacilitySchema(id="trichy-office", name="Trichy Office", district="Trichy", lat=10.7905, lng=78.7047, status="watch", energy=70, water=68, carbon=66, employees=95, waste=58, risk="medium"),
            FacilitySchema(id="tirunelveli-site", name="Tirunelveli Site", district="Tirunelveli", lat=8.7139, lng=77.7567, status="good", energy=72, water=79, carbon=48, employees=88, waste=54, risk="low"),
            FacilitySchema(id="vellore-lab", name="Vellore Lab", district="Vellore", lat=12.9165, lng=79.1325, status="watch", energy=68, water=71, carbon=61, employees=120, waste=57, risk="medium"),
            FacilitySchema(id="kanyakumari-depot", name="Kanyakumari Depot", district="Kanyakumari", lat=8.0883, lng=77.5385, status="good", energy=65, water=83, carbon=42, employees=52, waste=50, risk="low"),
        ]