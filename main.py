from fastapi import FastAPI
from routers.booking_router import router as booking_router
from routers.customer_router import router as customer_router
from database.connection import Base, engine

#Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Agendamento - AutoPro")

@app.get("/")
def root():
    return {
        "status": "API de Agendamento - AutoPro rodando",
        "docs": "http://127.0.0.1:8000/docs"
    }

app.include_router(booking_router)
app.include_router(customer_router)