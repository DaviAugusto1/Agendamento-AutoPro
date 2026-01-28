from sqlalchemy.orm import Session
from models import Customer

"""
table → class (Model)

Line → object

SELECT → query()

WHERE → filter()

INSERT → add() + commit()

UPDATE → alterar objeto + commit()

DELETE → delete() + commit()
"""

def create(db: Session, new_customer: Customer):
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

def get_all(db: Session):
    
    customers = (
        db.query(Customer)
        .all()
    )
    return customers

def get_by_Id(customerId: int, db: Session):
    customer_get = (
        db.query(Customer)
        .filter(Customer.customer_id == customerId)
        .first()
    )
    return customer_get

    
