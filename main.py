from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
import asyncio
from jobs.whatsapp_cron import notification_worker

load_dotenv()

DOCS_URL = os.getenv("DOCS_URL")
ORIGINS_TXT = os.getenv("ORIGINS_TXT")
#Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Run the automation job in the background
    task = asyncio.create_task(notification_worker())
    yield
    # Shutdown
    task.cancel()

app = FastAPI(title="API de Agendamento - AutoPro", lifespan=lifespan)

@app.get("/")
def root():
    return {
        "status": "API de Agendamento - AutoPro rodando",
        "docs": DOCS_URL
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ORIGINS_TXT],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers.booking_router import router as booking_router
from routers.customer_router import router as customer_router
from routers.car_details_router import router as car_details_router
from routers.customer_booking_router import router as customer_booking_router
from database.connection import Base, engine


app.include_router(booking_router)
app.include_router(customer_router)
app.include_router(car_details_router)
app.include_router(customer_booking_router)