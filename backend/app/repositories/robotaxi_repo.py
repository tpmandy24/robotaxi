from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.robotaxi import Robotaxi
from app.schemas.robotaxi_schema import RobotaxiCreate, RobotaxiUpdate


class RobotaxiRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, robotaxi_id: int) -> Optional[Robotaxi]:
        return self.db.query(Robotaxi).filter(Robotaxi.id == robotaxi_id).first()

    def get_by_vin(self, vin: str) -> Optional[Robotaxi]:
        return self.db.query(Robotaxi).filter(Robotaxi.vin == vin).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Robotaxi]:
        return self.db.query(Robotaxi).offset(skip).limit(limit).all()

    def create(self, robotaxi_in: RobotaxiCreate) -> Robotaxi:
        robotaxi = Robotaxi(**robotaxi_in.model_dump())
        self.db.add(robotaxi)
        self.db.commit()
        self.db.refresh(robotaxi)
        return robotaxi

    def update(self, robotaxi: Robotaxi, robotaxi_in: RobotaxiUpdate) -> Robotaxi:
        for field, value in robotaxi_in.model_dump(exclude_unset=True).items():
            setattr(robotaxi, field, value)
        self.db.commit()
        self.db.refresh(robotaxi)
        return robotaxi

    def delete(self, robotaxi: Robotaxi) -> None:
        self.db.delete(robotaxi)
        self.db.commit()
