from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time
from database.connection import Base


class Booking(Base):
    __tablename__ = "booking"
    id_booking = Column(Integer, primary_key=True, index=True, nullable=False)
    id_details = Column(Integer, ForeignKey("car_details.detail_id"), nullable=False)
    reason = Column(String(20), nullable=False)
    car_plate = Column(String(7), nullable=False)
    dt_booking = Column(Date, nullable=False)
    hr_booking = Column(Time, nullable=False)
    
