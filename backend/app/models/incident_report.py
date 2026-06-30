import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class IncidentSeverity(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True)
    robotaxi_id = Column(Integer, ForeignKey("robotaxis.id"), nullable=False, index=True)
    description = Column(Text, nullable=False)
    severity = Column(Enum(IncidentSeverity), nullable=False, default=IncidentSeverity.LOW)
    reported_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    robotaxi = relationship("Robotaxi", back_populates="incident_reports")
