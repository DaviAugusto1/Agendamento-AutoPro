from pydantic import BaseModel


class customer_bookingCreate(BaseModel):
    booking_id: int
    customer_id : int
    confirmation: str