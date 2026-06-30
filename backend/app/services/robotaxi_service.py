from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.robotaxi import Robotaxi
from app.repositories.robotaxi_repo import RobotaxiRepository
from app.schemas.robotaxi_schema import RobotaxiCreate, RobotaxiUpdate


class RobotaxiService:
    def __init__(self, db: Session):
        self.repo = RobotaxiRepository(db)

    def get_robotaxi(self, robotaxi_id: int) -> Robotaxi:
        robotaxi = self.repo.get(robotaxi_id)
        if not robotaxi:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Robotaxi not found")
        return robotaxi

    def list_robotaxis(self, skip: int = 0, limit: int = 100) -> List[Robotaxi]:
        return self.repo.get_all(skip=skip, limit=limit)

    def create_robotaxi(self, robotaxi_in: RobotaxiCreate) -> Robotaxi:
        if self.repo.get_by_vin(robotaxi_in.vin):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="VIN already registered")
        return self.repo.create(robotaxi_in)

    def update_robotaxi(self, robotaxi_id: int, robotaxi_in: RobotaxiUpdate) -> Robotaxi:
        robotaxi = self.get_robotaxi(robotaxi_id)
        return self.repo.update(robotaxi, robotaxi_in)

    def delete_robotaxi(self, robotaxi_id: int) -> None:
        robotaxi = self.get_robotaxi(robotaxi_id)
        self.repo.delete(robotaxi)
