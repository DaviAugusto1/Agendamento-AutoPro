from datetime import datetime, date, time, timedelta    
from sqlalchemy.orm import Session
from models import Booking
from fastapi import HTTPException
from repositories import booking_repository as repositorie
from sqlalchemy.exc import IntegrityError

def create(db: Session,
           details_id: int, 
           reason: str,
           service: str | None,
           car_plate: str,
           booking_dt: date,
           booking_hr: time):
    reasons = ["Orçamento", "Reparo", "Retorno"]
    reasons_pause = {"Orçamento": 15, "Reparo": 30} 
    weekday = booking_dt.weekday()  # 0 = segunda, 4 = sexta
    monday = booking_dt - timedelta(days=weekday)
    friday = monday + timedelta(days=4)
    formated_car_plate = car_plate.upper()
    
    if reason not in reasons:
        raise HTTPException(
            status_code=400,
            detail="Razão inválida!"
        )
    if booking_dt < date.today():
        raise HTTPException(
            status_code=400,
            detail="Data Inválida!"
        )
    if booking_hr > time(17, 0):
        raise HTTPException(
            status_code=400,
            detail="Agendamentos são aceitos somente até as 17:00"
        )
    if booking_hr < time(8, 30):
        raise HTTPException(
            status_code=400,
            detail="Agendamentos são aceitos somente apartir das 08:30"
        )
    
    booked_slots = repositorie.get_all_hours_by_day(db, booking_dt)
    
    new_dt = datetime.combine(booking_dt, booking_hr)
    for booked_hr, booked_reason in booked_slots:
        existing_dt = datetime.combine(booking_dt, booked_hr)
        existing_dt_plus_pause = existing_dt + timedelta(minutes=(reasons_pause[booked_reason]-1))
        diff = abs((new_dt - existing_dt).total_seconds()) / 60
        if existing_dt <= new_dt <= existing_dt_plus_pause:
            raise HTTPException(
            status_code=409,
            detail=f"Conflito no horário de inicio com agendamento para {booked_hr} até as {existing_dt_plus_pause}!"
        )
        elif diff < reasons_pause[reason]:
            raise HTTPException(
            status_code=409,
            detail=f"Conflito no horário de execução com agendamento para {booked_hr}!"
        )

    if reason == "Reparo" and service != "Martelinho de ouro":
        repairs = repositorie.count_repairs_by_week(db, monday, friday)
        print(repairs)
        if repairs >= 7:
            raise HTTPException(
            status_code=409,
            detail=f"Quantidade de limite de agendamentos de reparos já alcançado!")
    
    if service == "Martelinho de ouro" and reason == "Reparo":
        martelinhos = repositorie.count_martelinhos_by_day(db, booking_dt)
        if martelinhos >= 2:
            raise HTTPException(
            status_code=409,
            detail=f"Quantidade de limite diário de serviços de martelinhos já alcançado!")
        
    booking = Booking(
        details_id=details_id,
        reason=reason,
        service=service,
        car_plate=formated_car_plate,
        booking_dt=booking_dt,
        booking_hr=booking_hr
    )

    try:
        return repositorie.Create(db, booking)
    except IntegrityError:
        raise HTTPException(
        status_code=409,
        detail="Agendamento duplicado"
    )

def get_all_hours(db: Session, date: date):
    return repositorie.get_all_hours_by_day(db, date)