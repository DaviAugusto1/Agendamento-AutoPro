import { useEffect, useState } from 'react'
import { getBookings } from '../../services/booking_service'
import { BookingCard } from '../../Components/BookingCard'      
import type { Booking } from '../../types/booking'

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function loadBookings() {
      const data = await getBookings();
      setBookings(data);
    }

    loadBookings();
  }, [])

  return (
    <div>
      <h2>Agendamentos</h2>
      {bookings.map((booking) => (
          <BookingCard
            key={booking.booking_id}
            booking={booking}
          />
        ))}
      
    </div>
)
}
