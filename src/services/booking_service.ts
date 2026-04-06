import { api } from "../api/api"
import type { Booking } from "../types/booking"

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

export async function getBlockedDays() {
  const response = await api.get('/bookings/invalid_repair_days')
  return response.data
}

export async function getUnavailableTimes(date: string) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/bookings/blocked_booking_times/${date}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error("Erro ao buscar horários")
  }

  return data
}