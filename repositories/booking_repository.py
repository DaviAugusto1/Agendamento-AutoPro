from sqlalchemy.orm import Session
from models import Booking


def Create(db: Session, booking: Booking):
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking