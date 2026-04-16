import asyncio
from datetime import date, timedelta
from database.connection import SessionLocal
from models.booking import Booking
from models.customer import Customer
from models.customer_booking import Customer_booking
from services.whatsapp_service import send_whatsapp_message
import os

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Dicionário em memória para evitar envios duplicados no mesmo dia
_sent_notifications = set()

async def check_and_send_notifications():
    global _sent_notifications
    try:
        db = SessionLocal()
        tomorrow = date.today() + timedelta(days=1)
        
        # Limpar o cache de controle caso o dia tenha virado (só retemos os agendamentos de amanha)
        _sent_notifications = {key for key in _sent_notifications if key[0] == tomorrow}

        unconfirmed_bookings = (
            db.query(Booking, Customer)
            .join(Customer_booking, Booking.booking_id == Customer_booking.booking_id)
            .join(Customer, Customer_booking.customer_id == Customer.customer_id)
            .filter(Booking.booking_dt == tomorrow)
            .filter(Customer_booking.confirmation == "N")
            .all()
        )
        
        for booking, customer in unconfirmed_bookings:
            cache_key = (tomorrow, booking.booking_id)
            if cache_key in _sent_notifications:
                continue

            confirmation_link = f"{FRONTEND_URL}/confirm/{booking.booking_id}"
            hr_str = booking.booking_hr.strftime('%H:%M') if hasattr(booking.booking_hr, 'strftime') else booking.booking_hr
            dt_str = booking.booking_dt.strftime('%d/%m/%Y')
            
            message = (
                f"🏎️ Olá, *{customer.name}*!\n\n"
                f"O seu agendamento para *{booking.service}* ({booking.reason}) na AutoPro Atelier está marcado para *amanhã*, dia {dt_str} às {hr_str}.\n\n"
                f"✅ *Por favor, acesse o link abaixo para confirmar a sua presença:*\n"
                f"{confirmation_link}\n\n"
                f"Caso tenha algum imprevisto, avise-nos! Estamos aguardando sua visita.\n\n"
                f"Atenciosamente,\n"
                f"*Equipe AutoPro Atelier*"
            )
            
            send_whatsapp_message(customer.phone_number, message)
            _sent_notifications.add(cache_key)
            
        db.close()
    except Exception as e:
        print(f"Erro no job de notificações de WhatsApp: {e}")

async def notification_worker():
    """
    Roda como background task no FastAPI.
    A cada 1 hora verifica agendamentos de véspera para enviar notificação.
    """
    print("✅ Iniciando Worker Automático: Notificações de WhatsApp via Cron")
    while True:
        await check_and_send_notifications()
        # Dorme por 1 hora
        await asyncio.sleep(3600)
