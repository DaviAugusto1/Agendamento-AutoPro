from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time
from database.connection import Base


class Agendamento(Base):
    __tablename__ = "agendamento"
    id_agendamento = Column(Integer, primary_key=True, index=True, nullable=False)
    id_caracteristica = Column(Integer, ForeignKey("caracteristicas_carro.id_caracteristicas"), nullable=False)
    motivo = Column(String(20), nullable=False)
    placa_carro = Column(String(7), nullable=False)
    dt_agendamento = Column(Date, nullable=False)
    hr_agendamento = Column(Time, nullable=False)
    
