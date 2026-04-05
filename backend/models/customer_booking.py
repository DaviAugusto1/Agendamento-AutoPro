from sqlalchemy import Column, Integer, String, ForeignKey
from database.connection import Base

class Customer_booking(Base):
    __tablename__ = "customer_booking"
    customer_booking_id = Column(Integer, primary_key=True, index=True, nullable=False)
    booking_id = Column(Integer, ForeignKey("booking.booking_id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customer.customer_id"), nullable=False)
    confirmation = Column(String(1), nullable=False, default="N")