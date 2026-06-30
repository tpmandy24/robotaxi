from fastapi import FastAPI

from app.database import Base, engine
from app.routes.robotaxi_routes import router as robotaxi_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Robotaxi API",
    description="Fleet management API for registering, monitoring, and updating local Robotaxis.",
    version="1.0.0",
    docs_url="/swagger",
    openapi_tags=[
        {"name": "robotaxis", "description": "Manage the local Robotaxi fleet: register, list, update, and remove vehicles."},
    ],
)

app.include_router(robotaxi_router)


@app.get("/health", tags=["health"], summary="Health check", description="Returns a simple liveness check for the API.")
def health_check():
    return {"status": "ok"}
