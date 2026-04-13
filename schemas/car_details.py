from pydantic import BaseModel, Field, ConfigDict

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
    model_config = ConfigDict(from_attributes=True)
    details_id: int
    brand_name: str
    car_model: str
    car_color: str
    car_year: int

class CarDetailsCreateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    details_id: int
    brand_id: int
    car_model: str
    car_color: str
    car_year: int

class CarBrandsResponse(BaseModel):
    brand_id: int
    brand_name: str | None
    
class CarDetailsPlateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    car_model: str | None
    car_color: str | None
    car_year: int | None
    brand_id: int | None