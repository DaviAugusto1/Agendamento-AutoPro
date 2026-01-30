from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Booking
from datetime import date


def Create(db: Session, booking: Booking):
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def get_all(db: Session):
    bookings = (
        db.query(Booking)
        .all())
    return bookings

def get_booking_by_id(db: Session, id: int):
    booking = (
        db.query(Booking)
        .filter(Booking.booking_id == id)
    )
    return Booking

def get_bookings_by_car_plate(db: Session, plate: str):
    booking = (
        db.query(Booking)
        .filter(Booking.car_plate == plate)
        .order_by(Booking.booking_dt, Booking.booking_hr)
        .all()
    )
    return booking

def get_last_booking_by_reason(db: Session, reason: str):
    booking = (
        db.query(Booking)
        .filter(Booking.reason == reason)
        .order_by(Booking.booking_dt, Booking.booking_hr)
        .first()
    )
    return booking
    
def count_by_reason_in_week(db: Session, reason: str, start_date: date, end_date: date):
    booking_count = (
        db.query(func.count(Booking.booking_id))
        .filter(Booking.reason == reason, Booking.booking_dt.between(start_date, end_date))
        .scalar
    )
    return booking_count