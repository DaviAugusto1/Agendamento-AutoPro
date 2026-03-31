from sqlalchemy.orm import Session
from models import Customer_booking
from fastapi import HTTPException, status
from repositories import customer_booking_repositorie as repository
from sqlalchemy.exc import IntegrityError


def create(db: Session, customer_id: str, booking_id: str):
    
    new_customer_booking = Customer_booking(
        customer_id=customer_id,
        booking_id = booking_id
    )

    return repository.Create(db, new_customer_booking)



def confirm_booking(db: Session, booking_id: int):
    booking = repository.get_by_booking_id(db, booking_id)

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agendamento não encontrado"
        )

    if booking.confirmation == "S":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Agendamento já está confirmado"
        )

    booking.confirmation = "S"

    repository.confirm(db, booking)

    return {"message": "Agendamento confirmado com sucesso"}
