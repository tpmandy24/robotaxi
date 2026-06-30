from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.robotaxi_schema import RobotaxiCreate, RobotaxiResponse, RobotaxiUpdate
from app.services.robotaxi_service import RobotaxiService

router = APIRouter(prefix="/robotaxis", tags=["robotaxis"])


@router.post("/", response_model=RobotaxiResponse, status_code=201)
def create_robotaxi(robotaxi_in: RobotaxiCreate, db: Session = Depends(get_db)):
    return RobotaxiService(db).create_robotaxi(robotaxi_in)


@router.get("/", response_model=List[RobotaxiResponse])
def list_robotaxis(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return RobotaxiService(db).list_robotaxis(skip=skip, limit=limit)


@router.get("/{robotaxi_id}", response_model=RobotaxiResponse)
def get_robotaxi(robotaxi_id: int, db: Session = Depends(get_db)):
    return RobotaxiService(db).get_robotaxi(robotaxi_id)


@router.put("/{robotaxi_id}", response_model=RobotaxiResponse)
def update_robotaxi(robotaxi_id: int, robotaxi_in: RobotaxiUpdate, db: Session = Depends(get_db)):
    return RobotaxiService(db).update_robotaxi(robotaxi_id, robotaxi_in)


@router.delete("/{robotaxi_id}", status_code=204)
def delete_robotaxi(robotaxi_id: int, db: Session = Depends(get_db)):
    RobotaxiService(db).delete_robotaxi(robotaxi_id)
