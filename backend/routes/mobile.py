from fastapi import APIRouter, HTTPException

from seed_data import CHALLENGES, CSR_ACTIVITIES, EMPLOYEES, MOBILE_BOOTSTRAP

router = APIRouter(prefix="/api/mobile", tags=["mobile"])


@router.get("/employees")
def list_employees():
    return {"data": EMPLOYEES, "count": len(EMPLOYEES)}


@router.get("/bootstrap/{employee_id}")
def mobile_bootstrap(employee_id: str):
    """Initialize employee mobile session — XP, challenges, CSR, notifications."""
    payload = MOBILE_BOOTSTRAP.get(employee_id)
    if not payload:
        emp = next((e for e in EMPLOYEES if e["id"] == employee_id), None)
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")
        payload = {
            "employeeId": employee_id,
            "xp": 500,
            "points": 200,
            "rank": 25,
            "badges": [],
            "challenges": [],
            "csrActivities": [],
            "notifications": [{"id": "n0", "text": "Welcome to EcoSphere mobile", "read": False}],
        }
    return payload


@router.get("/challenges/catalog")
def challenge_catalog():
    return {"data": CHALLENGES, "count": len(CHALLENGES)}


@router.get("/csr/catalog")
def csr_catalog():
    return {"data": CSR_ACTIVITIES, "count": len(CSR_ACTIVITIES)}
