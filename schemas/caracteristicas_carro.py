from pydantic import BaseModel


class Caracteristicas_carroCreate(BaseModel):
    marca_carro: str
    modelo_carro: str
    cor_carro: str
    ano_carro: int