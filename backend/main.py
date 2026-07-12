from fastapi import FastAPI
from backend.routes import ai_routes


app = FastAPI(title="EcoSphere AI Backend")
app.include_router(ai_routes.router)

@app.get("/")
def root():
    return {"message": "EcoSphere AI backend running"}
