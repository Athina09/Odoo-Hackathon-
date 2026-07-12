from fastapi import APIRouter, Query

from seed_data import (
    CARBON_TRANSACTIONS,
    CHALLENGES,
    COMPLIANCE_ISSUES,
    CSR_ACTIVITIES,
    DEPARTMENTS,
    EMISSION_FACTORS,
    ESG_INSIGHTS,
    ESG_KPIS,
)

router = APIRouter(prefix="/api/esg", tags=["esg"])


@router.get("/health")
def esg_health():
    return {"status": "ok", "service": "ecosphere-esg"}


@router.get("/kpis")
def get_kpis():
    return ESG_KPIS


@router.get("/departments")
def list_departments():
    return {"data": DEPARTMENTS, "count": len(DEPARTMENTS)}


@router.get("/emission-factors")
def list_emission_factors():
    return {"data": EMISSION_FACTORS, "count": len(EMISSION_FACTORS)}


@router.get("/carbon-transactions")
def list_carbon(department: str | None = Query(None)):
    rows = CARBON_TRANSACTIONS
    if department:
        rows = [r for r in rows if r["department"].lower() == department.lower()]
    return {"data": rows, "count": len(rows)}


@router.get("/csr-activities")
def list_csr(department: str | None = Query(None)):
    rows = CSR_ACTIVITIES
    if department:
        rows = [r for r in rows if r["department"].lower() == department.lower()]
    return {"data": rows, "count": len(rows)}


@router.get("/compliance-issues")
def list_compliance(department: str | None = Query(None)):
    rows = COMPLIANCE_ISSUES
    if department:
        rows = [r for r in rows if r["department"].lower() == department.lower()]
    return {"data": rows, "count": len(rows)}


@router.get("/challenges")
def list_challenges():
    return {"data": CHALLENGES, "count": len(CHALLENGES)}


@router.get("/insights")
def list_insights(module: str | None = Query(None)):
    rows = ESG_INSIGHTS
    if module:
        rows = [r for r in rows if r["module"].lower() == module.lower()]
    return {"data": rows, "count": len(rows)}
