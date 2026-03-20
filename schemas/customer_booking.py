from pydantic import BaseModel
from datetime import date, time

class Customer_bookingBase(BaseModel):
    customer_booking_id: int
    customer_id: int
    booking_id: int
    confirmation: str
class Customer_bookingCreate(BaseModel):
    booking_id: int
    customer_id : int

class Customer_bookingCreateResponse(BaseModel):
    customer_booking_id: int
    customer_id: int
    booking_id: int
    confirmation: str
    class config:
        from_atributes = True
    
class Customer_bookingGetResponse(BaseModel):
        name: str
        phone_number: str
        reason: str
        service: str
        car_plate: str
        car_model: str
        car_color: str
        booking_dt: date
        booking_hr: time
        confirmation: str
        class config:
            from_atributes = True
