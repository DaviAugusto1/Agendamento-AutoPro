from sqlalchemy.orm import Session
from models import Customer_booking, Customer, Booking


def Create(db: Session, customer_booking: Customer_booking):
    db.add(customer_booking)
    db.commit()
    db.refresh(customer_booking)
    return customer_booking

def get_all(db:Session):
    customer_booking = (
        db.query(
            Customer_booking.customer_booking_id,
            Customer_booking.customer_id,
            Customer.name,
            Customer.phone_number)
        .outerjoin(Customer, Customer_booking.customer_id == Customer.customer_id)
        .outerjoin(Booking, Customer_booking.booking_id == Booking.booking_id)
        .all())
    return customer_booking

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