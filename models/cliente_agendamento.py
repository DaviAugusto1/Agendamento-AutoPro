from sqlalchemy import Column, Integer, String, ForeignKey
from database.connection import Base

class Cliente_agendamento(Base):
    __tablename__ = "cliente_agendamento"
    id_cliente_agendamento = Column(Integer, primary_key=True, index=True, nullable=False)
    id_agendamento = Column(Integer, ForeignKey("agendamento.id_agendamento"), nullable=False)
    id_cliente = Column(Integer, ForeignKey("cliente.id_cliente"), nullable=False)
    confirmacao = Column(String(1), nullable=False)