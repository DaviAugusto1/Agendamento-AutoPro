import { api } from "../api/api"
import type { Booking, BookingDetailed } from "../types/booking"

// ── Read Operations ───────────────────────────────────────────────

export async function getBookings(): Promise<Booking[]> {
  const response = await api.get('/bookings')
  return response.data
}

export async function getBookingsByMonth(year: number, month: number): Promise<Booking[]> {
  const response = await api.get('/bookings/by-month', {
    params: { year, month },
  })
  return response.data
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const response = await api.get(`/bookings/by-date/${date}`)
  return response.data
}

// ── Enriched Queries (Manager Dashboard) ──────────────────────────

export async function getDetailedBookingsByMonth(year: number, month: number): Promise<BookingDetailed[]> {
  const response = await api.get('/bookings/detailed/by-month', {
    params: { year, month },
  })
  return response.data
}

export async function getDetailedBookingsByDate(date: string): Promise<BookingDetailed[]> {
  const response = await api.get(`/bookings/detailed/by-date/${date}`)
  return response.data
}

// ── Blocked Dates/Times ───────────────────────────────────────────

export async function getBlockedDays() {
  const response = await api.get('/bookings/invalid_repair_days')
  return response.data
}

export async function getUnavailableTimes(date: string) {
  const response = await api.get(`/bookings/blocked_booking_times/${date}`)
  return response.data
}

// ── Write Operations (Manager Dashboard) ──────────────────────────

export interface CreateBookingPayload {
  details_id: number;
  reason: string;
  service: string | null;
  car_plate: string;
  booking_dt: string;
  booking_hr: string;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const response = await api.post('/bookings/', payload)
  return response.data
}

export interface UpdateBookingPayload {
  reason?: string;
  service?: string;
  car_plate?: string;
  booking_dt?: string;
  booking_hr?: string;
}

export async function updateBooking(bookingId: number, payload: UpdateBookingPayload): Promise<Booking> {
  const response = await api.patch(`/bookings/bookings/${bookingId}`, payload)
  return response.data
}

export async function deleteBooking(bookingId: number): Promise<void> {
  await api.delete(`/bookings/bookings/${bookingId}`)
}

export async function confirmBooking(bookingId: number): Promise<{ message: string }> {
  const response = await api.patch(`/customer_bookings/bookings/${bookingId}/confirm`)
  return response.data
}