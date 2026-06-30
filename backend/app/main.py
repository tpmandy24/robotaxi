from fastapi import FastAPI

from app.database import Base, engine
from app.routes.robotaxi_routes import router as robotaxi_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Robotaxi API")

app.include_router(robotaxi_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
