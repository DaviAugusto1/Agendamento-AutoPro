"""
Centralized business constants for the AutoPro booking system.

Keeping all domain-specific rules here avoids scattered magic numbers
and makes it trivial to adjust limits as business needs change.
"""
from datetime import time


# ── Booking Reasons ────────────────────────────────────────────────
VALID_REASONS = ("Orçamento", "Reparo", "Retorno")

# Duration (in minutes) each reason "blocks" in the schedule
REASON_DURATION_MINUTES = {
    "Orçamento": 15,
    "Reparo": 30,
}

# ── Business Hours ─────────────────────────────────────────────────
BUSINESS_HOURS_START = time(8, 30)
BUSINESS_HOURS_END = time(17, 0)

# ── Weekly / Daily Capacity Limits ─────────────────────────────────
MAX_REPAIRS_PER_WEEK = 7
MAX_MARTELINHOS_PER_DAY = 2

# ── Service Identifiers ───────────────────────────────────────────
SERVICE_MARTELINHO = "Martelinho de ouro"
SERVICE_PINTURA = "Pintura e(ou) Funilaria"

# ── Work‑Week Geometry ─────────────────────────────────────────────
WORK_WEEK_LENGTH_DAYS = 5  # Monday → Friday

# ── Confirmation Status ────────────────────────────────────────────
CONFIRMATION_YES = "S"
CONFIRMATION_NO = "N"
