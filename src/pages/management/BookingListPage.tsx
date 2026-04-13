import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDetailedBookingsByDate, deleteBooking, confirmBooking } from '../../services/booking_service';
import type { BookingDetailed } from '../../types/booking';
import { ManagerEditBookingModal } from './ManagerEditBookingModal';

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
  booking: BookingDetailed;
  onConfirm: (id: number) => void;
  onRemove: (id: number) => void;
  onEdit: (booking: BookingDetailed) => void;
}

function BookingCard({ booking, onConfirm, onRemove, onEdit }: Readonly<BookingCardProps>) {
  const badgeStyle = getReasonBadgeStyle(booking.reason);
  const isConfirmed = booking.confirmation === 'S';

  return (
    <div className="glass-effect rounded-xl p-5 border border-[#d4af37]/10 hover:border-[#d4af37]/25 transition-all flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${badgeStyle.bg} ${badgeStyle.text}`}>
            {booking.reason}
          </span>
          {isConfirmed ? (
            <span className="px-2 py-1 rounded text-xs font-bold bg-green-900/30 text-green-400 border border-green-500/30 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>Confirmado
            </span>
          ) : (
            <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-900/30 text-yellow-500 border border-yellow-500/30 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">pending</span>Pendente
            </span>
          )}
        </div>
        <span className="text-[#f2ca50] font-['Space_Grotesk'] font-bold text-lg">
          {booking.booking_hr}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {/* Car Details Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#d0c5af]">
             <span className="material-symbols-outlined text-base opacity-60">directions_car</span>
             <span>
              <span className="font-bold text-[#e5e2e1]">{booking.brand_name || 'Marca Desconhecida'}</span> - {booking.car_model || 'Modelo'}
             </span>
          </div>
          
          <div className="flex items-center gap-2 text-[#d0c5af]">
             <span className="material-symbols-outlined text-base opacity-60">palette</span>
             <span>Cor: <span className="text-[#e5e2e1]">{booking.car_color || '-'}</span> | Ano: <span className="text-[#e5e2e1]">{booking.car_year || '-'}</span></span>
          </div>

          <div className="flex items-center gap-2 text-[#d0c5af]">
            <span className="material-symbols-outlined text-base opacity-60">pin</span>
            <span className="font-mono uppercase tracking-widest bg-[#1c1b1b] px-2 py-0.5 rounded border border-[#353535]">
              {booking.car_plate}
            </span>
          </div>
        </div>

        {/* Action Info & buttons */}
        <div className="space-y-2 sm:text-right flex flex-col justify-between sm:items-end">
          {booking.service && (
            <div className="flex items-center sm:justify-end gap-2 text-[#d0c5af]">
              <span className="material-symbols-outlined text-base opacity-60 sm:order-last">build</span>
              <span>{booking.service}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 pt-2 sm:justify-end mt-auto">
            {!isConfirmed && (
               <button onClick={() => onConfirm(booking.booking_id)} className="px-3 py-1.5 rounded-lg bg-green-600/20 text-green-500 border border-green-600/30 hover:bg-green-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                 <span className="material-symbols-outlined text-sm">check</span> Confirmar
               </button>
            )}
            <button onClick={() => onEdit(booking)} className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">edit</span> Editar
            </button>
            <button onClick={() => onRemove(booking.booking_id)} className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-500 border border-red-600/30 hover:bg-red-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1">
               <span className="material-symbols-outlined text-sm">delete</span> Remover
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[#d0c5af]/50 text-xs pt-2 border-t border-[#353535]/50">
          <span>Agendamento ID: {booking.booking_id}</span>
      </div>
    </div>
  );
}

export function BookingListPage() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<BookingDetailed[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>(ALL_FILTER);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<BookingDetailed | null>(null);

  const fetchBookings = useCallback(async (targetDate: string) => {
    setIsLoading(true);
    try {
      const data = await getDetailedBookingsByDate(targetDate);
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

  const handleConfirm = useCallback(async (id: number) => {
    if (confirm("Deseja realmente confirmar este agendamento?")) {
      try {
        await confirmBooking(id);
        if (date) fetchBookings(date);
      } catch (e) {
         console.error("Erro ao confirmar:", e);
         alert("Não foi possível confirmar.");
      }
    }
  }, [date, fetchBookings]);

  const handleRemove = useCallback(async (id: number) => {
    if (confirm("Deseja realmente remover este agendamento? Esta ação é irreversível.")) {
      try {
        await deleteBooking(id);
        if (date) fetchBookings(date);
      } catch (e) {
         console.error("Erro ao remover:", e);
         alert("Não foi possível remover.");
      }
    }
  }, [date, fetchBookings]);

  const handleEdit = useCallback((booking: BookingDetailed) => {
    setBookingToEdit(booking);
    setIsEditModalOpen(true);
  }, []);

  const handleEditSuccess = useCallback(() => {
    if (date) fetchBookings(date);
  }, [date, fetchBookings]);

  const displayDate = date ? formatDateForDisplay(date) : '';

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#131313]/90 backdrop-blur-xl border-b border-[#d4af37]/15">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f2ca50] text-[#1c1b1b] text-sm font-bold shadow-[0_0_15px_rgba(242,202,80,0.2)] hover:bg-[#e6bf3d] hover:shadow-[0_0_20px_rgba(242,202,80,0.3)] transition-all uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Novo
           </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
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
              <BookingCard 
                 key={booking.booking_id} 
                 booking={booking} 
                 onConfirm={handleConfirm}
                 onRemove={handleRemove}
                 onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      <ManagerEditBookingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        booking={bookingToEdit}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
