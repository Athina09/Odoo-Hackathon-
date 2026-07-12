"""EcoSphere API — ESG data, mobile bootstrap, and RAG insight search.

Run from backend/:
  uvicorn main:app --host 127.0.0.1 --port 8000
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.esg import router as esg_router
from routes.mobile import router as mobile_router
from routes.rag import router as rag_router
from seed_data import SEED_VERSION

app = FastAPI(title="EcoSphere API", version="1.0.0", description="ESG management backend for Odoo Hackathon")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(esg_router)
app.include_router(mobile_router)
app.include_router(rag_router)


@app.get("/")
def root():
    return {
        "message": "EcoSphere API running",
        "seed": SEED_VERSION,
        "docs": "/docs",
        "endpoints": {
            "esg": "/api/esg/kpis",
            "mobile": "/api/mobile/bootstrap/{employee_id}",
            "rag": "/api/rag/search?query=manufacturing+carbon",
        },
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "seed": SEED_VERSION, "backend": "ecosphere"}
