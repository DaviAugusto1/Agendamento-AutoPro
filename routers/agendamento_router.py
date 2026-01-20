from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from schemas.agendamento import AgendamentoCreate
from services.agendamento_service import criar

router = APIRouter(prefix="/agendamentos", tags=["Agendamentos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def criar_agendamento(agendamento: AgendamentoCreate, db: Session = Depends(get_db)):
    try:
        return criar(
            db,
            agendamento.nome_cliente,
            agendamento.carro,
            agendamento.data_hora
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))