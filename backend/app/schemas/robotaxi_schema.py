from typing import Optional

from pydantic import BaseModel, ConfigDict


class RobotaxiBase(BaseModel):
    vin: str
    model: str
    status: str = "idle"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    battery_level: Optional[float] = None


class RobotaxiCreate(RobotaxiBase):
    pass


class RobotaxiUpdate(BaseModel):
    model: Optional[str] = None
    status: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    battery_level: Optional[float] = None


class RobotaxiResponse(RobotaxiBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
