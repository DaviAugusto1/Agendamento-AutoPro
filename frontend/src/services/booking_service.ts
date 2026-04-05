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
    `${import.meta.env.VITE_API_BASE_URL}/bookings/blocked_booking_times/${date}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error("Erro ao buscar horários")
  }

  return data
}