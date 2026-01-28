from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Customer
from repositories import customer_repository

def create(db: Session, name: str, phone: str):

    if len(phone) > 14:
        raise HTTPException(
            status_code=400,
            detail="Telefone deve ter obrigatoriamente 14 digitos!"
        )

    formated_name = name.split()
    for i, name_part in enumerate(formated_name):
        if len(name_part) > 2:
            formated_name[i] = name_part.capitalize()
    formated_name = " ".join(formated_name)
    
    new_costumer = Customer(
        name=formated_name,
        phone_number=phone
    )
    return customer_repository.create(db, new_costumer)

def get_all(db):
    return customer_repository.get_all(db)

def get_by_id(cliente_id, db):
    cliente = customer_repository.get_by_Id(cliente_id, db)
    
    if not cliente:
        raise HTTPException(
            status_code=404,
            detail="Cliente não encontrado"
        )
    return cliente