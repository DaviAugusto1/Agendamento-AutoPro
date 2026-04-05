from pydantic import BaseModel, Field

class CustomerBase(BaseModel):
    name: str
    phone_number: str
    
class CustomerCreate(BaseModel):
    name: str = Field (min_length=1, description="Nome é obrigatório")
    phone_number: str = Field(min_length=1, description="Telefone é obrigatório")

class CustomerResponse(BaseModel):
    customer_id: int
    name: str
    phone_number: str
    
    class config:
        from_atributes = True