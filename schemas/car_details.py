from pydantic import BaseModel, Field

class Car_detaisBase(BaseModel):
    brand_id: int
    car_model: str
    car_color: str
    car_year: int
    
class Car_detailsCreate(BaseModel):
    brand_id: int
    car_model: str = Field(min_length=1, description="O modelo do carro é obrigatório")
    car_color: str = Field(min_length=1, description="A cor do carro é obrigatória")
    car_year: int
class Car_detailsResponse(BaseModel):
    details_id: int
    brand_name: str
    car_model: str
    car_color: str
    car_year: int
    class config:
        from_atributes = True

class Car_brandsResponse(BaseModel):
    brand_id: int
    brand_name: str | None
    
class Car_detailsPlateResponse(BaseModel):
    car_model: str
    car_color: str | None
    car_year: int | None
    brand_id: int
    
    class config:
        from_attributes = True 