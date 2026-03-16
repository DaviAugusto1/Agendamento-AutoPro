import { api } from "../api/api"

export async function getBookings() {
  const response = await api.get('/bookings')

  return response.data
}

export async function getBlockedDays() {
  const response = await api.get('/bookings/invalid_repair_days')
  return response.data
}