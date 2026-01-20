from fastapi import FastAPI
from routers.agendamento_router import router as agendamento_router
from database.connection import Base, engine

#Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Agendamento - AutoPro")

app.include_router(agendamento_router)