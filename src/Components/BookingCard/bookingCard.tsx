import type { Booking } from '../../types/booking';
import { cardStyle, headerStyle, statusStyle, buttonStyle } from './style.ts'

interface BookingCardProps {
  booking: Booking;
  onConfirm?: (id: number) => void;
}

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3>{booking.service}</h3>
        <p><strong>ID do booking: </strong>{booking.booking_id}</p>
        <p><strong>Data: </strong> {booking.booking_dt}</p>
        <p><strong>Horário: </strong> {booking.booking_hr}</p>
        <p><strong>Placa do carro: </strong>{booking.car_plate}</p>
        <p><strong>ID dos detalhes: </strong>{booking.details_id}</p>
        <p><strong>Razão do agendamento: </strong>{booking.reason}</p>
        <p><strong>Serviço solicitado: </strong>{booking.service}</p>
      </div>
    </div>
  );
}
