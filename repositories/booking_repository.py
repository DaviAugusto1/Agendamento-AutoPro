from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Booking
from datetime import date, time
from sqlalchemy.exc import IntegrityError
from schemas.booking import BookingUpdate

def Create(db: Session, booking: Booking):
    db.add(booking)
    db.commit()
    db.refresh(booking)
    try:
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking
    except IntegrityError:
        db.rollback()
        raise

def get_all(db: Session):
    bookings = (
        db.query(Booking)
        .all())
    return bookings

def get_booking_by_id(db: Session, id: int):
    booking = (
        db.query(Booking)
        .filter(Booking.booking_id == id)
        .first()
    )
    return booking

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
        .scalar()
    )
    return booking_count

def get_all_dates_by_reason(db:Session, reason: str):
    results = (
        db.query(Booking.booking_dt)
        .filter(Booking.booking_dt >= date.today(), Booking.reason == reason)
        .order_by(Booking.booking_dt)
        .all()
    )
    return results

def get_all_hours_by_day(db: Session, date: date):
    result = (
        db.query(Booking.booking_hr, Booking.reason, Booking.booking_id)
        .filter(Booking.booking_dt == date) 
        .order_by(Booking.booking_hr)
        .all()
    )
    return result

def count_repairs_by_week(db:Session, start: date, end: date):
    result = (
        db.query(func.count(Booking.booking_id))
        .filter(Booking.reason == "Reparo", Booking.booking_dt.between(start, end), Booking.service != "Martelinho de ouro")
        .scalar()
    )
    return result

def count_martelinhos_by_day(db:Session, day: date):
    result = (
        db.query(func.count(Booking.booking_id))
        .filter(Booking.booking_dt == day, Booking.reason == "Reparo", Booking.service == "Martelinho de ouro")
        .scalar()
    )
    return result

def update_partial_by_id(
    db: Session,
    booking_id: int,
    data: BookingUpdate
):
    booking = (
        db.query(Booking)
        .filter(Booking.booking_id == booking_id)
        .first()
    )

    if not booking:
        return None

    if data.reason is not None:
        booking.reason = data.reason

    if data.service is not None:
        booking.service = data.service
        
    if data.booking_dt is not None:
        booking.booking_dt = data.booking_dt

    if data.booking_hr is not None:
        booking.booking_hr = data.booking_hr

    db.commit()
    db.refresh(booking)

    try:
        db.commit()
        db.refresh(booking)
        return booking
    except IntegrityError as e:
        db.rollback()
        raise e
    
def delete(db: Session, booking: Booking):
    try:
        db.delete(booking)
        db.commit()
    except Exception:
        db.rollback()
        raise
    

