from sqlalchemy import Column, Integer, String
from database.connection import Base

class Caracteristicas_carro(Base):
    __tablename__ = "caracteristicas_carro"
    id_caracteristicas = Column(Integer, primary_key=True, index=True, nullable=False)
    marca_carro = Column(String(50), nullable=True)
    modelo_carro = Column(String(50), nullable=False)
    cor_carro = Column(String(50), nullable=False)
    ano_carro = Column(Integer, nullable=True)