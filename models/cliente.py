from sqlalchemy import Column, Integer, String
from database.connection import Base

class Cliente(Base):
    __tablename__ = "cliente"
    id_cliente = Column(Integer, primary_key=True, index=True, nullable=False)
    nome = Column(String(255), nullable=False)
    telefone = Column(String(15), nullable=True)