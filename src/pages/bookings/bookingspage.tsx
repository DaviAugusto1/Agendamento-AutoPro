import { useEffect } from 'react'
import { getBookings } from '../../services/booking_service'



export function BookingsPage() {
  useEffect(() => {
    getBookings().then(data => {
      console.log('Agendamentos:', data)
    })
  }, [])
  
  return <h2>Agendamentos</h2>
}
