from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class RideLog(Base):
    __tablename__ = "ride_logs"

    id = Column(Integer, primary_key=True, index=True)
    robotaxi_id = Column(Integer, ForeignKey("robotaxis.id"), nullable=False, index=True)
    pickup_location = Column(String, nullable=False)
    dropoff_location = Column(String, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    distance_miles = Column(Float, nullable=True)
    rider_rating = Column(Integer, nullable=True)

    robotaxi = relationship("Robotaxi", back_populates="ride_logs")
