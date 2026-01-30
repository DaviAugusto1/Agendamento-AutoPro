from pydantic import BaseModel, Field
from datetime import time, date
    
    
class bookingCreate(BaseModel):
    details_id: int
    reason: str
    car_plate: str
    booking_dt: date
    booking_hr: time
    
