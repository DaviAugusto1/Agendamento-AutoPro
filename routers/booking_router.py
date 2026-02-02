from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime, time
from database.connection import SessionLocal
from schemas import booking as schema
from services.booking_service import create, get_all_hours

router = APIRouter(prefix="/bookings", tags=["Bookings"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schema.BookingCreateResponse, status_code=201)
def bookingCreate(booking: schema.bookingCreate, db: Session = Depends(get_db)):
    try:
        return create(
            db,
            booking.details_id,
            booking.reason,
            booking.car_plate,
            booking.booking_dt,
            booking.booking_hr
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/byDay/{day}", response_model=list[schema.BookingDisponibilityResponse], status_code=201)
def get_all_hours_by_date(day: date, db: Session = Depends(get_db)):
    return get_all_hours(db, day)   