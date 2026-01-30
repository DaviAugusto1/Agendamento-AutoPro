from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time
from database.connection import Base


class Booking(Base):
    __tablename__ = "booking"
    booking_id = Column(Integer, primary_key=True, index=True, nullable=False)
    details_id = Column(Integer, ForeignKey("car_details.detail_id"), nullable=False)
    reason = Column(String(20), nullable=False)
    car_plate = Column(String(7), nullable=False)
    booking_dt = Column(Date, nullable=False)
    booking_hr = Column(Time, nullable=False)
    
