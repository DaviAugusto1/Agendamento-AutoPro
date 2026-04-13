from datetime import datetime, date, time, timedelta    
from sqlalchemy.orm import Session
from models import Booking
from fastapi import HTTPException, status
from repositories import booking_repository as repository
from sqlalchemy.exc import IntegrityError
from schemas.booking import BookingUpdate
from constants import (
    VALID_REASONS,
    REASON_DURATION_MINUTES,
    BUSINESS_HOURS_START,
    BUSINESS_HOURS_END,
    MAX_REPAIRS_PER_WEEK,
    MAX_MARTELINHOS_PER_DAY,
    SERVICE_MARTELINHO,
    WORK_WEEK_LENGTH_DAYS,
)


# ── Helpers ─────────────────────────────────────────────────────────

def _get_week_boundaries(target_date: date) -> tuple[date, date]:
    """Return (monday, friday) for the ISO week that contains *target_date*."""
    weekday = target_date.weekday()
    monday = target_date - timedelta(days=weekday)
    friday = monday + timedelta(days=WORK_WEEK_LENGTH_DAYS - 1)
    return monday, friday


def _validate_reason(reason: str) -> None:
    if reason not in VALID_REASONS:
        raise HTTPException(
            status_code=400,
            detail="Razão inválida!",
        )


def _validate_booking_date(booking_dt: date) -> None:
    if booking_dt < date.today():
        raise HTTPException(
            status_code=400,
            detail="Data Inválida!",
        )


def _validate_booking_time(booking_hr: time) -> None:
    if booking_hr > BUSINESS_HOURS_END:
        raise HTTPException(
            status_code=400,
            detail="Agendamentos são aceitos somente até as 17:00",
        )
    if booking_hr < BUSINESS_HOURS_START:
        raise HTTPException(
            status_code=400,
            detail="Agendamentos são aceitos somente apartir das 08:30",
        )


def _validate_time_conflicts(
    db: Session,
    booking_dt: date,
    booking_hr: time,
    reason: str,
    exclude_booking_id: int | None = None,
) -> None:
    """Raise 409 if the new slot overlaps any existing booking on the same day."""
    booked_slots = repository.get_all_hours_by_day(db, booking_dt)
    new_dt = datetime.combine(booking_dt, booking_hr)

    for booked_hr, booked_reason, slot_id in booked_slots:
        if exclude_booking_id is not None and slot_id == exclude_booking_id:
            continue

        existing_dt = datetime.combine(booking_dt, booked_hr)
        existing_duration = REASON_DURATION_MINUTES.get(booked_reason, 0)
        existing_end = existing_dt + timedelta(minutes=existing_duration - 1)

        diff_minutes = abs((new_dt - existing_dt).total_seconds()) / 60
        new_duration = REASON_DURATION_MINUTES.get(reason, 0)

        if existing_dt <= new_dt <= existing_end:
            full_end = existing_dt + timedelta(minutes=existing_duration)
            raise HTTPException(
                status_code=409,
                detail=(
                    f"Conflito no horário de inicio com agendamento para "
                    f"{booked_hr} até as {full_end}!"
                ),
            )
        if diff_minutes < new_duration:
            raise HTTPException(
                status_code=409,
                detail=(
                    f"Conflito no horário de execução com agendamento "
                    f"para {booked_hr}!"
                ),
            )


def _validate_repair_capacity(
    db: Session,
    booking_dt: date,
    reason: str,
    service: str | None,
) -> None:
    """Enforce weekly repair and daily martelinho limits."""
    monday, friday = _get_week_boundaries(booking_dt)

    if reason == "Reparo" and service != SERVICE_MARTELINHO:
        repairs = repository.count_repairs_by_week(db, monday, friday)
        if repairs >= MAX_REPAIRS_PER_WEEK:
            raise HTTPException(
                status_code=409,
                detail="Quantidade de limite de agendamentos de reparos já alcançado!",
            )

    if service == SERVICE_MARTELINHO and reason == "Reparo":
        martelinhos = repository.count_martelinhos_by_day(db, booking_dt)
        if martelinhos >= MAX_MARTELINHOS_PER_DAY:
            raise HTTPException(
                status_code=409,
                detail="Quantidade de limite diário de serviços de martelinhos já alcançado!",
            )


# ── Public Service Functions ────────────────────────────────────────

def create(
    db: Session,
    details_id: int,
    reason: str,
    service: str | None,
    car_plate: str,
    booking_dt: date,
    booking_hr: time,
):
    formatted_car_plate = car_plate.upper()

    _validate_reason(reason)
    _validate_booking_date(booking_dt)
    _validate_booking_time(booking_hr)
    _validate_time_conflicts(db, booking_dt, booking_hr, reason)
    _validate_repair_capacity(db, booking_dt, reason, service)

    booking = Booking(
        details_id=details_id,
        reason=reason,
        service=service,
        car_plate=formatted_car_plate,
        booking_dt=booking_dt,
        booking_hr=booking_hr,
    )

    try:
        return repository.create(db, booking)
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Agendamento duplicado",
        )


def get_all(db: Session):
    return repository.get_all(db)


def get_bookings_by_month(db: Session, year: int, month: int):
    first_day = date(year, month, 1)
    if month == 12:
        last_day = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = date(year, month + 1, 1) - timedelta(days=1)
    return repository.get_bookings_by_date_range(db, first_day, last_day)


def get_bookings_by_date(db: Session, target_date: date):
    return repository.get_bookings_by_date(db, target_date)


def get_detailed_bookings_by_date(db: Session, target_date: date):
    """Return enriched bookings for the booking list page."""
    return repository.get_detailed_bookings_by_date(db, target_date)


def get_detailed_bookings_by_month(db: Session, year: int, month: int):
    """Return enriched bookings for the calendar page."""
    first_day = date(year, month, 1)
    if month == 12:
        last_day = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = date(year, month + 1, 1) - timedelta(days=1)
    return repository.get_detailed_bookings_by_month(db, first_day, last_day)


def update_booking(
    db: Session,
    booking_id: int,
    data: BookingUpdate,
):
    try:
        _validate_booking_date(data.booking_dt)
        _validate_booking_time(data.booking_hr)
        _validate_time_conflicts(
            db, data.booking_dt, data.booking_hr, data.reason,
            exclude_booking_id=booking_id,
        )
        _validate_repair_capacity(db, data.booking_dt, data.reason, data.service)

        booking = repository.update_partial_by_id(db, booking_id, data)

        if not booking:
            raise HTTPException(
                status_code=404,
                detail="Agendamento não encontrado",
            )

        return booking
    except IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Já existe um agendamento com essas informações",
        )


def delete(db: Session, id: int):
    booking = repository.get_booking_by_id(db, id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agendamento não encontrado",
        )

    repository.delete(db, booking)

    return {"message": "Agendamento removido com sucesso"}


def get_invalid_days(db: Session):
    martelinho_days = repository.get_blocked_martelinho_days(db)
    painting_weeks = repository.get_blocked_painting_weeks(db)

    blocked_dates = {
        "Martelinho": [d.isoformat() for d in martelinho_days],
        "Pintura": [],
    }

    for (monday,) in painting_weeks:
        friday = monday + timedelta(days=WORK_WEEK_LENGTH_DAYS)
        blocked_dates["Pintura"].append([
            monday.isoformat(),
            friday.isoformat(),
        ])

    return blocked_dates


def get_invalid_times(db: Session, target_date: date):
    booked_times = repository.get_all_hours_by_day(db, target_date)
    blocked_times = []
    for hour, reason, _booking_id in booked_times:
        duration = REASON_DURATION_MINUTES.get(reason, 0)
        end_time = datetime.combine(target_date, hour) + timedelta(minutes=duration - 1)
        blocked_times.append([
            hour.strftime("%H:%M"),
            end_time.time().strftime("%H:%M"),
        ])

    return blocked_times