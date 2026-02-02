from datetime import datetime, date, time, timedelta    
from sqlalchemy.orm import Session
from models import Booking
from fastapi import HTTPException
from repositories import booking_repository as repositorie

def create(db: Session,
           details_id: int, 
           reason: str,
           car_plate: str,
           booking_dt: date,
           booking_hr: time):
    reasons = ["Orçamento", "Reparo", "Retorno"] 
    
    formated_car_plate = car_plate.upper()
    
    if reason not in reasons:
        raise HTTPException(
            status_code=400,
            detail="Razão inválida!"
        )
    if booking_dt < date.today():
        raise HTTPException(
            status_code=400,
            detail="Data Inválida"
        )
    
    
    booking = Booking(
        details_id=details_id,
        reason=reason,
        car_plate=formated_car_plate,
        booking_dt=booking_dt,
        booking_hr=booking_hr
    )
    return repositorie.Create(db, booking)

def get_all_hours(db: Session, date: date):
    return repositorie.get_all_hours_by_day(db, date)