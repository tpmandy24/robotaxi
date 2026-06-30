from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.robotaxi import CleaningStatus, OperationalStatus, Robotaxi
from app.schemas.robotaxi_schema import RobotaxiCreate, RobotaxiUpdate


class RobotaxiRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, robotaxi_id: int) -> Optional[Robotaxi]:
        return self.db.query(Robotaxi).filter(Robotaxi.id == robotaxi_id).first()

    def get_by_vin(self, vin: str) -> Optional[Robotaxi]:
        return self.db.query(Robotaxi).filter(Robotaxi.vin == vin).first()

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        operational_status: Optional[OperationalStatus] = None,
        cleaning_status: Optional[CleaningStatus] = None,
        model: Optional[str] = None,
        location: Optional[str] = None,
    ) -> List[Robotaxi]:
        query = self.db.query(Robotaxi)
        if operational_status is not None:
            query = query.filter(Robotaxi.operational_status == operational_status)
        if cleaning_status is not None:
            query = query.filter(Robotaxi.cleaning_status == cleaning_status)
        if model is not None:
            query = query.filter(Robotaxi.model.ilike(f"%{model}%"))
        if location is not None:
            query = query.filter(Robotaxi.current_location.ilike(f"%{location}%"))
        return query.offset(skip).limit(limit).all()

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
