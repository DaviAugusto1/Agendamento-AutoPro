from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import SessionLocal
#from schemas import ClienteCreate -- só precisa se precisar checar os dados
from services.cliente_service import consultar

router = APIRouter(prefix="/clientes", tags=["Clientes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def consultar_clientes(db: Session = Depends(get_db)):
    return consultar(db)