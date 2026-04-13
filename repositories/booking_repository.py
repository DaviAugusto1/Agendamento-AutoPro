from sqlalchemy.orm import Session
from sqlalchemy import func, text, case, literal
from models import Booking, Car_details, Car_brands, Customer_booking
from datetime import date, time
from sqlalchemy.exc import IntegrityError
from schemas.booking import BookingUpdate
from constants import (
    MAX_MARTELINHOS_PER_DAY,
    MAX_REPAIRS_PER_WEEK,
    SERVICE_MARTELINHO,
    SERVICE_PINTURA,
    CONFIRMATION_YES,
    CONFIRMATION_NO,
)


def create(db: Session, booking: Booking):
    try:
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking
    except IntegrityError:
        db.rollback()
        raise


def get_all(db: Session):
    return db.query(Booking).all()


def get_bookings_by_date_range(db: Session, start_date: date, end_date: date):
    return (
        db.query(Booking)
        .filter(Booking.booking_dt.between(start_date, end_date))
        .order_by(Booking.booking_dt, Booking.booking_hr)
        .all()
    )


def get_bookings_by_date(db: Session, target_date: date):
    return (
        db.query(Booking)
        .filter(Booking.booking_dt == target_date)
        .order_by(Booking.booking_hr)
        .all()
    )


def get_booking_by_id(db: Session, booking_id: int):
    return (
        db.query(Booking)
        .filter(Booking.booking_id == booking_id)
        .first()
    )


def get_bookings_by_car_plate(db: Session, plate: str):
    return (
        db.query(Booking)
        .filter(Booking.car_plate == plate)
        .order_by(Booking.booking_dt, Booking.booking_hr)
        .all()
    )


def get_last_booking_by_reason(db: Session, reason: str):
    return (
        db.query(Booking)
        .filter(Booking.reason == reason)
        .order_by(Booking.booking_dt, Booking.booking_hr)
        .first()
    )

    
def count_by_reason_in_week(db: Session, reason: str, start_date: date, end_date: date):
    return (
        db.query(func.count(Booking.booking_id))
        .filter(
            Booking.reason == reason,
            Booking.booking_dt.between(start_date, end_date),
        )
        .scalar()
    )


def get_all_dates_by_reason(db: Session, reason: str):
    return (
        db.query(Booking.booking_dt)
        .filter(Booking.booking_dt >= date.today(), Booking.reason == reason)
        .order_by(Booking.booking_dt)
        .all()
    )


def get_all_hours_by_day(db: Session, target_date: date):
    return (
        db.query(Booking.booking_hr, Booking.reason, Booking.booking_id)
        .filter(Booking.booking_dt == target_date)
        .order_by(Booking.booking_hr)
        .all()
    )


def count_repairs_by_week(db: Session, start: date, end: date):
    return (
        db.query(func.count(Booking.booking_id))
        .filter(
            Booking.reason == "Reparo",
            Booking.booking_dt.between(start, end),
            Booking.service != SERVICE_MARTELINHO,
        )
        .scalar()
    )


def get_blocked_painting_weeks(db: Session):
    query = text("""
        SELECT DATE_SUB(booking_dt, INTERVAL WEEKDAY(booking_dt) DAY) AS week_start
        FROM booking
        WHERE service = :service_name
        GROUP BY week_start
        HAVING COUNT(booking_id) >= :max_repairs""")

    result = db.execute(
        query,
        {"service_name": SERVICE_PINTURA, "max_repairs": MAX_REPAIRS_PER_WEEK},
    ).fetchall()
    return result


def get_blocked_martelinho_days(db: Session):
    result = (
        db.query(Booking.booking_dt)
        .filter(
            Booking.service == SERVICE_MARTELINHO,
            Booking.reason == "Reparo",
        )
        .group_by(Booking.booking_dt)
        .having(func.count(Booking.booking_id) >= MAX_MARTELINHOS_PER_DAY)
        .all()
    )
    return [row[0] for row in result]


def count_martelinhos_by_day(db: Session, day: date):
    return (
        db.query(func.count(Booking.booking_id))
        .filter(
            Booking.booking_dt == day,
            Booking.reason == "Reparo",
            Booking.service == SERVICE_MARTELINHO,
        )
        .scalar()
    )


def update_partial_by_id(
    db: Session,
    booking_id: int,
    data: BookingUpdate,
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


# ── Enriched Queries (Manager Dashboard) ───────────────────────────

def _base_detailed_query(db: Session):
    """Build the base query that joins Booking → Car_details → Car_brands and Customer_booking."""
    return (
        db.query(
            Booking.booking_id,
            Booking.details_id,
            Booking.reason,
            Booking.service,
            Booking.car_plate,
            Booking.booking_dt,
            Booking.booking_hr,
            Car_brands.brand_name,
            Car_details.car_model,
            Car_details.car_color,
            Car_details.car_year,
            func.coalesce(Customer_booking.confirmation, CONFIRMATION_NO).label("confirmation"),
        )
        .outerjoin(Car_details, Booking.details_id == Car_details.details_id)
        .outerjoin(Car_brands, Car_details.brand_id == Car_brands.brand_id)
        .outerjoin(Customer_booking, Booking.booking_id == Customer_booking.booking_id)
    )


def get_detailed_bookings_by_date(db: Session, target_date: date):
    """Return enriched bookings for a single day (used by the booking list page)."""
    rows = (
        _base_detailed_query(db)
        .filter(Booking.booking_dt == target_date)
        .order_by(Booking.booking_hr)
        .all()
    )
    return [row._asdict() for row in rows]


def get_detailed_bookings_by_month(db: Session, start_date: date, end_date: date):
    """Return enriched bookings for a date range (used by the calendar page)."""
    rows = (
        _base_detailed_query(db)
        .filter(Booking.booking_dt.between(start_date, end_date))
        .order_by(Booking.booking_dt, Booking.booking_hr)
        .all()
    )
    return [row._asdict() for row in rows]
