from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.robotaxi import CleaningStatus, OperationalStatus


class RobotaxiBase(BaseModel):
    vin: str = Field(
        min_length=17,
        max_length=17,
        description="17-character Vehicle Identification Number. Must be unique across the fleet.",
        examples=["5YJ3E1EA1PF000001"],
    )
    model: str = Field(
        description="Vehicle model designation.",
        examples=["Cybercab", "Model Y - Autonomous"],
    )
    battery_level: float = Field(
        default=100.0,
        ge=0,
        le=100,
        description="Current battery charge as a percentage (0-100).",
        examples=[87.5],
    )
    operational_status: OperationalStatus = Field(
        default=OperationalStatus.IDLE,
        description="Current operational state of the vehicle.",
        examples=[OperationalStatus.IDLE.value],
    )
    cleaning_status: CleaningStatus = Field(
        default=CleaningStatus.CLEAN,
        description="Current cleaning state of the vehicle.",
        examples=[CleaningStatus.CLEAN.value],
    )
    current_location: str = Field(
        description="Human-readable current location of the vehicle.",
        examples=["Zone A Dropoff", "Supercharger Bay 4"],
    )


class RobotaxiCreate(RobotaxiBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "vin": "5YJ3E1EA1PF000001",
                "model": "Cybercab",
                "battery_level": 100.0,
                "operational_status": "Idle",
                "cleaning_status": "Clean",
                "current_location": "Zone A Dropoff",
            }
        }
    )


class RobotaxiUpdate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "operational_status": "Charging",
                "cleaning_status": "Needs Cleaning",
            }
        }
    )

    model: Optional[str] = Field(default=None, description="Vehicle model designation.")
    battery_level: Optional[float] = Field(
        default=None, ge=0, le=100, description="Current battery charge as a percentage (0-100)."
    )
    operational_status: Optional[OperationalStatus] = Field(
        default=None, description="Current operational state of the vehicle."
    )
    cleaning_status: Optional[CleaningStatus] = Field(
        default=None, description="Current cleaning state of the vehicle."
    )
    current_location: Optional[str] = Field(
        default=None, description="Human-readable current location of the vehicle."
    )


class RobotaxiResponse(RobotaxiBase):
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(description="Unique identifier for the Robotaxi.", examples=[1])
