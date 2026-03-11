import { api } from "../api/api"

export async function getBookings() {
  const response = await api.get('/bookings')

  return response.data
}
