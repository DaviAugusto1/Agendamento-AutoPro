from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from schemas import booking
from services.booking_service import create

router = APIRouter(prefix="/bookings", tags=["Bookings"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def bookingCreate(booking: booking.bookingCreate, db: Session = Depends(get_db)):
    try:
        return create(
            db,
            booking.customer_name,
            booking.car,
            booking.date
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))