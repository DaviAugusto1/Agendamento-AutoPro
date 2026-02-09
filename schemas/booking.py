from pydantic import BaseModel, Field
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
    car_plate: str = Field (min_length= 7, description="O campo de placa é obrigatório")
    booking_dt: date
    booking_hr: time

class BookingCreateResponse(BaseModel):
    booking_id: int
    details_id: int
    reason: str
    service: str | None
    car_plate: str
    booking_dt: date
    booking_hr: time
    
    class config:
        from_atributes = True

class BookingDisponibilityResponse(BaseModel):
    booking_hr: time
    reason: str
    class config:
        from_atributes = True

class BookingUpdate(BaseModel):
    details_id: Optional[int] = None
    reason: Optional[str] = None
    service: Optional[str] = None
    car_plate: Optional[str] = None
    booking_dt: Optional[date] = None
    booking_hr: Optional[time] = None