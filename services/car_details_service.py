from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from models import Car_details
from repositories import car_details_repository

def create(db: Session, brand: int, model: str, color: str, year: int):
    
    if len(year) != 4:
        raise HTTPException(
            status_code=400,
            detail="O ano do carro deve ter 4 dígitos!"
        )