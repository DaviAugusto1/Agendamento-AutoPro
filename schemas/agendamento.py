from pydantic import BaseModel
from datetime import datetime, time, date


class ClienteCreate(BaseModel):
    nome: str
    telefone: str

class Caracteristicas_carroCreate(BaseModel):
    marca_carro: str
    modelo_carro: str
    cor_carro: str
    ano_carro: int
    
class AgendamentoCreate(BaseModel):
    id_caracteristica: int
    motivo: str
    placa_carro: str
    dt_agendamento: date
    hr_agendamento: time
    
class Cliente_agendamentoCreate(BaseModel):
    id_agendamento: int
    id_cliente : int
    confirmacao: str