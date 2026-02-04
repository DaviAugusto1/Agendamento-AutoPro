from pydantic import BaseModel, Field
from datetime import time, date
    
    


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
