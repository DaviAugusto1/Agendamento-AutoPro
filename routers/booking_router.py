from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, datetime, time
from database.connection import SessionLocal
from schemas import booking as schema
from services import booking_service as service

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
        return service.create(
            db,
            booking.details_id,
            booking.reason,
            booking.service,
            booking.car_plate,
            booking.booking_dt,
            booking.booking_hr
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) 

@router.get("/", response_model=list[schema.BookingResponse], status_code=201)
def get_all_bookings(db: Session = Depends(get_db)):
    return service.get_all(db)

@router.get("/invalid_repair_days", status_code=201)
def get_invalid_dates(db: Session = Depends(get_db)):
    return service.get_invalid_days(db)

@router.patch(
    "/bookings/{booking_id}",
    response_model=schema.BookingCreateResponse
)
def update_booking(
    booking_id: int,
    booking: schema.BookingUpdate,
    db: Session = Depends(get_db)
):
    return service.update_booking(
        db,
        booking_id,
        booking
    )

@router.delete("/bookings/{booking_id}", status_code=204)
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    service.delete(db, booking_id)

