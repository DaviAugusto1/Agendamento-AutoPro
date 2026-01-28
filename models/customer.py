from sqlalchemy import Column, Integer, String
from database.connection import Base

class Customer(Base):
    __tablename__ = "customer"
    customer_id = Column(Integer, primary_key=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    phone_number = Column(String(14), nullable=True)