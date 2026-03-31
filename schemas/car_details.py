from pydantic import BaseModel, Field

class CarDetailsBase(BaseModel):
    brand_id: int
    car_model: str
    car_color: str
    car_year: int
    
class CarDetailsCreate(BaseModel):
    brand_id: int
    car_model: str = Field(min_length=1, description="O modelo do carro é obrigatório")
    car_color: str = Field(min_length=1, description="A cor do carro é obrigatória")
    car_year: int
class CarDetailsResponse(BaseModel):
    details_id: int
    brand_name: str
    car_model: str
    car_color: str
    car_year: int
    class Config:
        from_attributes = True

class CarDetailsCreateResponse(BaseModel):
    details_id: int
    brand_id: int
    car_model: str
    car_color: str
    car_year: int
    class Config:
        from_attributes = True

class CarBrandsResponse(BaseModel):
    brand_id: int
    brand_name: str | None
    
class CarDetailsPlateResponse(BaseModel):
    car_model: str | None
    car_color: str | None
    car_year: int | None
    brand_id: int | None
    
    class config:
        from_attributes = True 