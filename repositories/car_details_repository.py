from sqlalchemy.orm import Session
from models import Car_details, Car_brands


def Create(db: Session, car_details: Car_details):
    db.add(car_details)
    db.commit()
    db.refresh(car_details)
    return car_details

def get_all(db:Session):
    car_details = (
        db.query(
            Car_details.details_id,
            Car_details.car_model,
            Car_details.car_color,
            Car_details.car_year,
            Car_brands.brand_name.label("brand_name"))
        .outerjoin(Car_brands, Car_brands.brand_id == Car_details.brand_id)
        .all())
    return car_details

def get_by_id(db: Session, car_details_id: int):
    car_details = (
        db.query(            
            Car_details.details_id,
            Car_details.car_model,
            Car_details.car_color,
            Car_details.car_year,
            Car_brands.brand_name.label("brand_name"))
        .outerjoin(Car_brands, Car_brands.brand_id == Car_details.brand_id)
        .filter(Car_details.details_id == car_details_id)
        .first()
    )
    return car_details

def get_by_all(db: Session, brand: int, model: str, color: str, year: str | None):
    car_details = (
        db.query(Car_details)
        .filter(Car_details.brand_id == brand, Car_details.car_color == color, Car_details.car_model == model, Car_details.car_year == year)
        .first()
    )
    return car_details