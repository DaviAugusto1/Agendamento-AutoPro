from sqlalchemy.orm import Session
from models import Customer_booking, Customer, Booking, Car_details
from datetime import date


def Create(db: Session, customer_booking: Customer_booking):
    db.add(customer_booking)
    db.commit()
    db.refresh(customer_booking)
    return customer_booking

def get_all(db:Session):
    customer_booking = (
        db.query(
            Customer.name,
            Customer.phone_number,
            Booking.reason,
            Booking.service,
            Booking.car_plate,
            Car_details.car_model,
            Car_details.car_color,
            Booking.booking_dt,
            Booking.booking_hr,
            Customer_booking.confirmation
            )
        .select_from(Customer_booking)
        .outerjoin(Customer, Customer_booking.customer_id == Customer.customer_id)
        .outerjoin(Booking, Customer_booking.booking_id == Booking.booking_id)
        .outerjoin(Car_details, Booking.details_id == Car_details.details_id)
        .all())
    return customer_booking

def get_by_id(db: Session, id: int):
    customer_booking = (
        db.query(
            Customer.name,
            Customer.phone_number,
            Booking.reason,
            Booking.service,
            Booking.car_plate,
            Car_details.car_model,
            Car_details.car_color,
            Booking.booking_dt,
            Booking.booking_hr,
            Customer_booking.confirmation
            )
        .select_from(Customer_booking)
        .outerjoin(Customer, Customer_booking.customer_id == Customer.customer_id)
        .outerjoin(Booking, Customer_booking.booking_id == Booking.booking_id)
        .outerjoin(Car_details, Booking.details_id == Car_details.details_id)
        .filter(Customer_booking.customer_booking_id == id)
        .first()
        )
    return customer_booking

def get_by_day(db: Session, day: date):
    customer_booking = (
        db.query(
            Customer.name,
            Customer.phone_number,
            Booking.reason,
            Booking.service,
            Booking.car_plate,
            Car_details.car_model,
            Car_details.car_color,
            Booking.booking_dt,
            Booking.booking_hr,
            Customer_booking.confirmation
            )
        .select_from(Customer_booking)
        .outerjoin(Customer, Customer_booking.customer_id == Customer.customer_id)
        .outerjoin(Booking, Customer_booking.booking_id == Booking.booking_id)
        .outerjoin(Car_details, Booking.details_id == Car_details.details_id)
        .filter(Booking.booking_dt == day)
        .all()
        )
    return customer_booking

def get_today(db: Session):
    customer_booking = (
        db.query(
            Customer.name,
            Customer.phone_number,
            Booking.reason,
            Booking.service,
            Booking.car_plate,
            Car_details.car_model,
            Car_details.car_color,
            Booking.booking_dt,
            Booking.booking_hr,
            Customer_booking.confirmation
            )
        .select_from(Customer_booking)
        .outerjoin(Customer, Customer_booking.customer_id == Customer.customer_id)
        .outerjoin(Booking, Customer_booking.booking_id == Booking.booking_id)
        .outerjoin(Car_details, Booking.details_id == Car_details.details_id)
        .filter(Booking.booking_dt == date.today())
        .all()
        )
    return customer_booking

def get_by_booking_id(db: Session, id: int):
    customer_booking = (
        db.query(Customer_booking)
        .filter(Customer_booking.booking_id == id)
        .first()
        )
    return customer_booking

def confirm(db: Session, customer_booking: Customer_booking):
    try:
        db.commit()
        db.refresh(customer_booking)
    except Exception:
        db.rollback()
        raise
