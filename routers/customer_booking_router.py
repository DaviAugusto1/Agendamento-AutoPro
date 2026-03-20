from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from schemas import customer_booking as schema
from services import customer_booking_service as service

router = APIRouter(prefix="/customer_bookings", tags=["Customer_bookings"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.patch("/bookings/{booking_id}/confirm")
def confirm_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    return service.confirm_booking(db, booking_id)

@router.post("/", response_model=schema.Customer_bookingCreateResponse, status_code=201)
def bookingCreate(booking: schema.Customer_bookingCreate, db: Session = Depends(get_db)):
    try:
        return service.create(
            db,
            booking.booking_id,
            booking.customer_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))