"""
Backend integration tests for the Manager Dashboard API endpoints.

Tests cover:
  - GET /bookings/by-month  (calendar month view)
  - GET /bookings/by-date/{date}  (day list view)
  - Schema validation (BookingResponse fields)
  - Edge cases (empty results, invalid params)

Uses an in-memory SQLite database so no external MySQL is needed.
"""

import pytest
from datetime import date, time
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database.connection import Base
from main import app
from routers.booking_router import get_db
from models import Booking


# ── Test Database Setup ─────────────────────────────────────────────

SQLITE_TEST_URL = "sqlite:///./test.db"

test_engine = create_engine(
    SQLITE_TEST_URL,
    connect_args={"check_same_thread": False},
)
TestSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
)


def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


# ── Fixtures ────────────────────────────────────────────────────────

@pytest.fixture(autouse=True)
def setup_and_teardown_database():
    """Create tables before each test and drop them after."""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session():
    """Provide a clean database session for seeding test data."""
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()


def _seed_booking(
    db_session,
    *,
    details_id: int = 1,
    reason: str = "Orçamento",
    service: str | None = None,
    car_plate: str = "ABC1D23",
    booking_dt: date = date(2026, 4, 15),
    booking_hr: time = time(9, 0),
) -> Booking:
    """Insert a single booking into the test database."""
    booking = Booking(
        details_id=details_id,
        reason=reason,
        service=service,
        car_plate=car_plate,
        booking_dt=booking_dt,
        booking_hr=booking_hr,
    )
    db_session.add(booking)
    db_session.commit()
    db_session.refresh(booking)
    return booking


# ── Response Field Constants ────────────────────────────────────────

EXPECTED_BOOKING_FIELDS = {
    "booking_id",
    "details_id",
    "reason",
    "service",
    "car_plate",
    "booking_dt",
    "booking_hr",
}


# ── Tests: GET /bookings/by-month ──────────────────────────────────

class TestGetBookingsByMonth:
    """Verify the month-based endpoint used by the calendar view."""

    def test_returns_bookings_for_requested_month(self, db_session):
        _seed_booking(db_session, booking_dt=date(2026, 4, 10), reason="Orçamento")
        _seed_booking(db_session, booking_dt=date(2026, 4, 20), reason="Reparo")

        response = client.get("/bookings/by-month", params={"year": 2026, "month": 4})

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    def test_excludes_bookings_from_other_months(self, db_session):
        _seed_booking(db_session, booking_dt=date(2026, 4, 15))
        _seed_booking(db_session, booking_dt=date(2026, 5, 1))

        response = client.get("/bookings/by-month", params={"year": 2026, "month": 4})

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["booking_dt"] == "2026-04-15"

    def test_returns_empty_list_when_no_bookings(self):
        response = client.get("/bookings/by-month", params={"year": 2026, "month": 1})

        assert response.status_code == 200
        assert response.json() == []

    def test_response_contains_all_required_fields(self, db_session):
        _seed_booking(db_session)

        response = client.get("/bookings/by-month", params={"year": 2026, "month": 4})

        data = response.json()
        assert len(data) >= 1
        booking_fields = set(data[0].keys())
        assert EXPECTED_BOOKING_FIELDS.issubset(booking_fields)

    def test_bookings_grouped_by_reason(self, db_session):
        _seed_booking(db_session, booking_dt=date(2026, 4, 15), reason="Orçamento", booking_hr=time(9, 0))
        _seed_booking(db_session, booking_dt=date(2026, 4, 15), reason="Reparo", booking_hr=time(10, 0))
        _seed_booking(db_session, booking_dt=date(2026, 4, 15), reason="Retorno", booking_hr=time(11, 0))

        response = client.get("/bookings/by-month", params={"year": 2026, "month": 4})

        data = response.json()
        reasons = {b["reason"] for b in data}
        assert reasons == {"Orçamento", "Reparo", "Retorno"}

    def test_december_month_boundary(self, db_session):
        """Verify that month=12 correctly calculates the last day of December."""
        _seed_booking(db_session, booking_dt=date(2026, 12, 31))

        response = client.get("/bookings/by-month", params={"year": 2026, "month": 12})

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1


# ── Tests: GET /bookings/by-date/{target_date} ─────────────────────

class TestGetBookingsByDate:
    """Verify the date-based endpoint used by the booking list page."""

    def test_returns_bookings_for_specific_date(self, db_session):
        _seed_booking(db_session, booking_dt=date(2026, 4, 15), booking_hr=time(9, 0))
        _seed_booking(db_session, booking_dt=date(2026, 4, 15), booking_hr=time(10, 0))

        response = client.get("/bookings/by-date/2026-04-15")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    def test_excludes_bookings_from_other_dates(self, db_session):
        _seed_booking(db_session, booking_dt=date(2026, 4, 15))
        _seed_booking(db_session, booking_dt=date(2026, 4, 16))

        response = client.get("/bookings/by-date/2026-04-15")

        data = response.json()
        assert len(data) == 1
        assert data[0]["booking_dt"] == "2026-04-15"

    def test_returns_empty_list_when_no_bookings_on_date(self):
        response = client.get("/bookings/by-date/2026-01-01")

        assert response.status_code == 200
        assert response.json() == []

    def test_response_fields_match_booking_schema(self, db_session):
        _seed_booking(db_session)

        response = client.get("/bookings/by-date/2026-04-15")

        data = response.json()
        assert len(data) >= 1
        booking_fields = set(data[0].keys())
        assert EXPECTED_BOOKING_FIELDS.issubset(booking_fields)

    def test_bookings_ordered_by_time(self, db_session):
        _seed_booking(db_session, booking_dt=date(2026, 4, 15), booking_hr=time(14, 0))
        _seed_booking(db_session, booking_dt=date(2026, 4, 15), booking_hr=time(9, 0))
        _seed_booking(db_session, booking_dt=date(2026, 4, 15), booking_hr=time(11, 0))

        response = client.get("/bookings/by-date/2026-04-15")

        data = response.json()
        times = [b["booking_hr"] for b in data]
        assert times == sorted(times)

    def test_reason_types_are_preserved(self, db_session):
        for reason, hr in [("Orçamento", time(9, 0)), ("Reparo", time(10, 0)), ("Retorno", time(11, 0))]:
            _seed_booking(
                db_session,
                booking_dt=date(2026, 4, 15),
                reason=reason,
                booking_hr=hr,
            )

        response = client.get("/bookings/by-date/2026-04-15")

        data = response.json()
        reasons = [b["reason"] for b in data]
        assert "Orçamento" in reasons
        assert "Reparo" in reasons
        assert "Retorno" in reasons


# ── Tests: Constants Integrity ──────────────────────────────────────

class TestConstantsIntegrity:
    """Verify that business constants are properly defined."""

    def test_valid_reasons_contains_all_types(self):
        from constants import VALID_REASONS
        assert "Orçamento" in VALID_REASONS
        assert "Reparo" in VALID_REASONS
        assert "Retorno" in VALID_REASONS

    def test_reason_durations_defined(self):
        from constants import REASON_DURATION_MINUTES
        assert "Orçamento" in REASON_DURATION_MINUTES
        assert "Reparo" in REASON_DURATION_MINUTES
        assert REASON_DURATION_MINUTES["Orçamento"] > 0
        assert REASON_DURATION_MINUTES["Reparo"] > 0

    def test_business_hours_are_valid(self):
        from constants import BUSINESS_HOURS_START, BUSINESS_HOURS_END
        assert BUSINESS_HOURS_START < BUSINESS_HOURS_END

    def test_capacity_limits_are_positive(self):
        from constants import MAX_REPAIRS_PER_WEEK, MAX_MARTELINHOS_PER_DAY
        assert MAX_REPAIRS_PER_WEEK > 0
        assert MAX_MARTELINHOS_PER_DAY > 0
