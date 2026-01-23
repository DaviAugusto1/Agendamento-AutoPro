from sqlalchemy.orm import Session
from models import Agendamento


def criar_agendamento(db: Session, agendamento: Agendamento):
    db.add(agendamento)
    db.commit()
    db.refresh(agendamento)
    return agendamento