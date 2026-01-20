from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time
from database.connection import Base


class Cliente(Base):
    __tablename__ = "cliente"
    id_cliente = Column(Integer, primary_key=True, index=True, nullable=False)
    nome = Column(String(255), nullable=False)
    telefone = Column(String(15), nullable=True)

class Caracteristicas_carro(Base):
    __tablename__ = "caracteristicas_carro"
    id_caracteristicas = Column(Integer, primary_key=True, index=True, nullable=False)
    marca_carro = Column(String(50), nullable=True)
    modelo_carro = Column(String(50), nullable=False)
    cor_carro = Column(String(50), nullable=False)
    ano_carro = Column(Integer, nullable=True)

class Agendamento(Base):
    __tablename__ = "agendamento"
    id_agendamento = Column(Integer, primary_key=True, index=True, nullable=False)
    id_caracteristica = Column(Integer, ForeignKey("caracteristicas_carro.id_caracteristicas"), nullable=False)
    motivo = Column(String(20), nullable=False)
    placa_carro = Column(String(7), nullable=False)
    dt_agendamento = Column(Date, nullable=False)
    hr_agendamento = Column(Time, nullable=False)
    
class Cliente_agendamento(Base):
    __tablename__ = "cliente_agendamento"
    id_cliente_agendamento = Column(Integer, primary_key=True, index=True, nullable=False)
    id_agendamento = Column(Integer, ForeignKey("agendamento.id_agendamento"), nullable=False)
    id_cliente = Column(Integer, ForeignKey("cliente.id_cliente"), nullable=False)
    confirmacao = Column(String(1), nullable=False)