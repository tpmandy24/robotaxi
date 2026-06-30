import enum

from sqlalchemy import CheckConstraint, Column, Enum, Float, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class OperationalStatus(str, enum.Enum):
    IN_SERVICE = "In Service"
    CHARGING = "Charging"
    MAINTENANCE = "Maintenance"
    IDLE = "Idle"


class CleaningStatus(str, enum.Enum):
    CLEAN = "Clean"
    NEEDS_CLEANING = "Needs Cleaning"
    CLEANING_IN_PROGRESS = "Cleaning in Progress"


class Robotaxi(Base):
    __tablename__ = "robotaxis"
    __table_args__ = (
        CheckConstraint("length(vin) = 17", name="ck_robotaxi_vin_length"),
        CheckConstraint("battery_level >= 0 AND battery_level <= 100", name="ck_robotaxi_battery_level_range"),
    )

    id = Column(Integer, primary_key=True, index=True)
    vin = Column(String(17), unique=True, index=True, nullable=False)
    model = Column(String, nullable=False)
    battery_level = Column(Float, nullable=False, default=100.0)
    operational_status = Column(Enum(OperationalStatus), nullable=False, default=OperationalStatus.IDLE)
    cleaning_status = Column(Enum(CleaningStatus), nullable=False, default=CleaningStatus.CLEAN)
    current_location = Column(String, nullable=False)

    incident_reports = relationship(
        "IncidentReport", back_populates="robotaxi", cascade="all, delete-orphan"
    )
    ride_logs = relationship(
        "RideLog", back_populates="robotaxi", cascade="all, delete-orphan"
    )
