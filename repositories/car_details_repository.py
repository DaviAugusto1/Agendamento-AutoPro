from sqlalchemy.orm import Session
from models import Car_details


def Create(db: Session, car_details: Car_details):
    db.add(car_details)
    db.commit()
    db.refresh(car_details)
    return car_details

def get_all(db:Session):
    car_details = (
        db.query(Car_details)
        .all())
    return car_details

def get_by_id(db: Session, car_details_id: int):
    car_details = (
        db.query(Car_details)
        .filter(Car_details.details_id == car_details_id)
        .first()
    )
    return car_details