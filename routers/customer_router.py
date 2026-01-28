from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from schemas import CustomerCreate, CustomerResponse
from services.customer_service import get_all, get_by_id, create

router = APIRouter(prefix="/customer", tags=["Customer"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_all_customers(db: Session = Depends(get_db)):
    return get_all(db)

@router.get("/byId/{id}")
def get_customer_by_id(id: int, db: Session = Depends(get_db)):
    return get_by_id(id, db)

@router.post("/", reponse_model=CustomerResponse, status_code=201)
def customerCreate(customer: CustomerCreate, db: Session = Depends(get_db)):
    try:
        return create(
            db,
            customer.name,
            customer.phone_number
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
        
