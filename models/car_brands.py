from sqlalchemy import Column, Integer, String
from database.connection import Base

class Car_brands(Base):
    __tablename__ = "car_brands"
    brand_id = Column(Integer, primary_key=True, index=True, nullable=False)
    brand_name = Column(String(255), nullable=True)