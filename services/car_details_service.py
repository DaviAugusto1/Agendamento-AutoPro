from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from models import Car_details
from repositories import car_details_repository

def create(db: Session, brand: int, model: str, color: str, year: int):
    
    if len(str(year)) != 4:
        raise HTTPException(
            status_code=400,
            detail="O ano do carro deve ter 4 dígitos!"
        )
        
    formated_color = color.capitalize()
    
    existing_details = car_details_repository.get_by_all(db, brand, model, color, year)
    
    new_car_details = Car_details(
        brand_id=brand,
        car_model = model,
        car_color = formated_color,
        car_year = year
    )
    
    try:
        return car_details_repository.Create(db, new_car_details)
    except IntegrityError:
        db.rollback()
        return existing_details
    
def get_all(db: Session):
    return car_details_repository.get_all(db)

def get_by_id(db:Session, id: int):
    
    details = car_details_repository.get_by_id(db, id)
    
    if not details:
        raise HTTPException(
            status_code=404,
            detail="Cliente não encontrado"
        )
    
    return details