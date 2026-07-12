
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.database import engine, Base
from backend.models import User, KPISnapshot, DepartmentScore, Facility, FeedItem
from backend.models import CarbonTrend, EsgRadar, DepartmentScoresChart, TopEmitters
from backend.models import AIRecommendation, EnvironmentCase
from backend.routers import auth, dashboard
from backend.seed import seed_all


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

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    seed_all()
    yield
    # Shutdown (if needed)


app = FastAPI(title="EcoSphere ESG Backend", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"message": "EcoSphere ESG Backend running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}

