from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.connection import SessionLocal
from schemas import Car_detailsCreate, Car_detailsResponse, Car_brandsResponse
from services.car_details_service import get_all, get_by_id, create, get_all_brands

router = APIRouter(prefix="/car_details", tags=["Car_details"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[Car_detailsResponse], status_code=201)
def get_all_car_details(db: Session = Depends(get_db)):
    return get_all(db)
    
@router.get("/byId/{id}", response_model=Car_detailsResponse)
def get_car_details_by_id(id: int, db: Session = Depends(get_db)):
    return get_by_id(db, id)

@router.get("/get_brands", response_model=list[Car_brandsResponse], status_code=201)
def get_brands(db: Session = Depends(get_db)):
    return get_all_brands(db)

@router.post("/", response_model=Car_detailsResponse, status_code=201)
def car_detailsCreate(car_details: Car_detailsCreate, db: Session = Depends(get_db)):
    try:
        return create(
            db,
            car_details.brand_id,
            car_details.car_model,
            car_details.car_color,
            car_details.car_year
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))