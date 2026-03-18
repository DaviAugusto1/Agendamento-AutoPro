import { api } from "../api/api"

export async function getBookings() {
  const response = await api.get('/bookings')

  return response.data
}

export async function getBlockedDays() {
  const response = await api.get('/bookings/invalid_repair_days')
  return response.data
}

export async function getUnavailableTimes(date: string) {
  const response = await fetch(
    `http://localhost:8000/bookings/blocked_booking_times/${date}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error("Erro ao buscar horários")
  }

  return data
}