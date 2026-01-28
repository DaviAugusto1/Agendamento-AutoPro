from pydantic import BaseModel


class car_detailsCreate(BaseModel):
    car_brand: str
    car_model: str
    car_color: str
    car_year: int