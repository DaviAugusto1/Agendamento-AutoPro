from pydantic import BaseModel, Field

class car_detaisBase(BaseModel):
    brand_id: int
    car_model: str
    car_color: str
    car_year: int
class car_detailsCreate(BaseModel):
    brand_id: int
    car_model: str = Field(min_length=1, description="O modelo do carro é obrigatório")
    car_color: str = Field(min_length=1, description="A cor do carro é obrigatória")
    car_year: int
    
class car_detailsResponse(BaseModel):
    brand_id: int
    car_model: str
    car_color: str
    car_year: int
    class config:
        from_atributes = True