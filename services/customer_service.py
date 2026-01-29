from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from models import Customer
from repositories import customer_repository

def create(db: Session, name: str, phone: str):
    
    if len(phone) != 13:
        raise HTTPException(
            status_code=400,
            detail="Telefone deve ter 14 digitos!"
        )

    formated_name = name.split()
    for i, name_part in enumerate(formated_name):
        if len(name_part) > 2:
            formated_name[i] = name_part.capitalize()
    formated_name = " ".join(formated_name)
    
    existing_customer = customer_repository.get_by_phone_and_name(formated_name, phone, db)
    
    new_customer = Customer(
        name=formated_name,
        phone_number=phone
    )
    
    try:
        return customer_repository.create(db, new_customer)
    except IntegrityError:
        db.rollback()
        return existing_customer
    
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