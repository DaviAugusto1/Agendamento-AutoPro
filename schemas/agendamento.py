from pydantic import BaseModel
from datetime import time, date
    
    
class AgendamentoCreate(BaseModel):
    id_caracteristica: int
    motivo: str
    placa_carro: str
    dt_agendamento: date
    hr_agendamento: time
    
