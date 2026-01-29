from sqlalchemy import Column, Integer, String, ForeignKey
from database.connection import Base

class Car_details(Base):
    __tablename__ = "car_details"
    details_id = Column(Integer, primary_key=True, index=True, nullable=False)
    brand_id = Column(Integer, ForeignKey("car_brands.brand_id"), nullable=False)
    car_model = Column(String(50), nullable=False)
    car_color = Column(String(50), nullable=False)
    car_year = Column(Integer, nullable=True)