from pydantic import BaseModel, ConfigDict, Field
from datetime import time, date
from typing import Optional


class BookingBase(BaseModel):
    details_id: int
    reason: str
    service: str | None
    car_plate: str
    booking_dt: date
    booking_hr: time


class bookingCreate(BaseModel):
    details_id: int
    reason: str
    service: str | None
    car_plate: str = Field(min_length=7, description="O campo de placa é obrigatório")
    booking_dt: date
    booking_hr: time


class BookingCreateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    booking_id: int
    details_id: int
    reason: str
    service: str | None
    car_plate: str
    booking_dt: date
    booking_hr: time


class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    booking_id: int
    details_id: int
    reason: str
    service: str | None
    car_plate: str
    booking_dt: date
    booking_hr: time


class BookingDetailedResponse(BaseModel):
    """Enriched booking with car details and confirmation for the manager dashboard."""
    booking_id: int
    details_id: int
    reason: str
    service: str | None
    car_plate: str
    booking_dt: date
    booking_hr: time
    brand_name: str | None = None
    car_model: str | None = None
    car_color: str | None = None
    car_year: int | None = None
    confirmation: str = "N"


class PaintingPerDayResponse(BaseModel):
    day: date


class BookingUpdate(BaseModel):
    details_id: Optional[int] = None
    reason: Optional[str] = None
    service: Optional[str] = None
    car_plate: Optional[str] = None
    booking_dt: Optional[date] = None
    booking_hr: Optional[time] = None