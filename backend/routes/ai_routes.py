from fastapi import APIRouter

router = APIRouter()

@router.get("/api/departments")
def list_departments():
    return {"message": "List of departments"}

@router.get("/api/emissions/factors")
def list_factors():
    return {"message": "List of emission factors"}
