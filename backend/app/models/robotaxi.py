from sqlalchemy import Column, Float, Integer, String

from app.database import Base


class Robotaxi(Base):
    __tablename__ = "robotaxis"

    id = Column(Integer, primary_key=True, index=True)
    vin = Column(String, unique=True, index=True, nullable=False)
    model = Column(String, nullable=False)
    status = Column(String, default="idle", nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    battery_level = Column(Float, nullable=True)
