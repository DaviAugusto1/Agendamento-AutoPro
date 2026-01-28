from pydantic import BaseModel

class CustomerBase(BaseModel):
    name: str
    phone_number: str
    
class CustomerCreate(BaseModel):
    pass

class CustomerResponse(BaseModel):
    customer_id: int
    
    class config:
        from_atributes = True