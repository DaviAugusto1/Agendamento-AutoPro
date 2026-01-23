from datetime import datetime
from sqlalchemy.orm import Session
from models import Agendamento
from repositories.agendamento_repository import criar_agendamento

def criar(db: Session, nome_cliente: str, carro: str, data_hora: datetime):
    if data_hora < datetime.now():
        raise ValueError("Não é possível agendar para datas passadas.")
    
    agendamento = Agendamento(
        nome_cliente=nome_cliente,
        carro=carro,
        data_hora=data_hora
    )
    return criar_agendamento(db, agendamento)