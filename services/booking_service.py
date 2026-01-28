from datetime import datetime
from sqlalchemy.orm import Session
from models import booking
from repositories.booking_repository import Create as rCreate

def create(db: Session, nome_cliente: str, carro: str, data_hora: datetime):
    if data_hora < datetime.now():
        raise ValueError("Não é possível agendar para datas passadas.")
    
    Booking = booking(
        nome_cliente=nome_cliente,
        carro=carro,
        data_hora=data_hora
    )
    return rCreate(db, Booking)