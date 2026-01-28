from sqlalchemy import Column, Integer, String
from database.connection import Base

class Car_details(Base):
    __tablename__ = "car_details"
    details_id = Column(Integer, primary_key=True, index=True, nullable=False)
    car_brand = Column(String(50), nullable=True)
    car_model = Column(String(50), nullable=False)
    car_color = Column(String(50), nullable=False)
    car_year = Column(Integer, nullable=True)