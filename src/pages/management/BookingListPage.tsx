import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingsByDate } from '../../services/booking_service';
import type { Booking } from '../../types/booking';

const CALENDAR_ROUTE = '/manager/calendar';
const ALL_FILTER = 'Todos';
const EMPTY_STATE_MESSAGE = 'Nenhum agendamento encontrado';
const LOADING_MESSAGE = 'Carregando agendamentos...';

const FILTER_OPTIONS = [ALL_FILTER, 'Orçamento', 'Reparo', 'Retorno'] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

const REASON_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  Orçamento: { bg: 'bg-blue-200', text: 'text-blue-800' },
  Reparo: { bg: 'bg-green-200', text: 'text-green-800' },
  Retorno: { bg: 'bg-yellow-200', text: 'text-yellow-800' },
};

const DEFAULT_BADGE_STYLE = { bg: 'bg-gray-200', text: 'text-gray-800' };

function getReasonBadgeStyle(reason: string) {
  return REASON_BADGE_STYLES[reason] ?? DEFAULT_BADGE_STYLE;
}

function formatDateForDisplay(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

interface BookingCardProps {
  readonly booking: Booking;
}

function BookingCard({ booking }: BookingCardProps) {
  const badgeStyle = getReasonBadgeStyle(booking.reason);

  return (
    <div className="glass-effect rounded-xl p-5 border border-[#d4af37]/10 hover:border-[#d4af37]/25 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeStyle.bg} ${badgeStyle.text}`}>
          {booking.reason}
        </span>
        <span className="text-[#f2ca50] font-['Space_Grotesk'] font-bold text-lg">
          {booking.booking_hr}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        {booking.service && (
          <div className="flex items-center gap-2 text-[#d0c5af]">
            <span className="material-symbols-outlined text-base opacity-60">build</span>
            <span>{booking.service}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[#d0c5af]">
          <span className="material-symbols-outlined text-base opacity-60">directions_car</span>
          <span className="font-mono uppercase">{booking.car_plate}</span>
        </div>

        <div className="flex items-center gap-2 text-[#d0c5af]/60 text-xs mt-3 pt-3 border-t border-[#353535]/50">
          <span>ID: {booking.booking_id}</span>
          <span className="text-[#353535]">•</span>
          <span>Detalhes: {booking.details_id}</span>
        </div>
      </div>
    </div>
  );
}

export function BookingListPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>(ALL_FILTER);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async (targetDate: string) => {
    setIsLoading(true);
    try {
      const data = await getBookingsByDate(targetDate);
      setBookings(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) {
      fetchBookings(date);
    }
  }, [date, fetchBookings]);

  const filteredBookings = useMemo(() => {
    if (activeFilter === ALL_FILTER) {
      return bookings;
    }
    return bookings.filter((booking) => booking.reason === activeFilter);
  }, [bookings, activeFilter]);

  const handleBackToCalendar = useCallback(() => {
    navigate(CALENDAR_ROUTE);
  }, [navigate]);

  const displayDate = date ? formatDateForDisplay(date) : '';

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#131313]/90 backdrop-blur-xl border-b border-[#d4af37]/15">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={handleBackToCalendar}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#d0c5af] hover:border-[#f2ca50]/40 hover:text-[#f2ca50] transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <div>
            <h1 className="font-['Space_Grotesk'] text-lg font-bold tracking-wide uppercase text-[#f2ca50]">
              Agendamentos
            </h1>
            <p className="text-[#d0c5af] text-sm opacity-70">{displayDate}</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-[#f2ca50] text-[#1c1b1b] font-bold shadow-[0_0_15px_rgba(242,202,80,0.25)]'
                  : 'bg-[#1c1b1b] border border-[#353535] text-[#d0c5af] hover:border-[#f2ca50]/30'
              }`}
            >
              {filter}
              {filter !== ALL_FILTER && (
                <span className="ml-1.5 opacity-70">
                  ({bookings.filter((b) => b.reason === filter).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-[#d0c5af]">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            <span>{LOADING_MESSAGE}</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#d0c5af]/60">
            <span className="material-symbols-outlined text-4xl mb-3 opacity-40">event_busy</span>
            <p className="text-sm">{EMPTY_STATE_MESSAGE}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.booking_id} booking={booking} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
