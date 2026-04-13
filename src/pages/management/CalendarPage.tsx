import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { DatesSetArg, EventInput } from '@fullcalendar/core';
import { getDetailedBookingsByMonth } from '../../services/booking_service';
import type { BookingDetailed } from '../../types/booking';
import { REASON_LABELS, type ReasonKey, REASON_COLORS, SERVICES } from '../../constants/bookingConstants';

const AUTH_STORAGE_KEY = 'manager_auth';
const LOGIN_ROUTE = '/admin';
const BOOKINGS_ROUTE_PREFIX = '/manager/bookings';

interface DayBookingCount {
  date: string;
  counts: Record<ReasonKey, number>;
}

function groupBookingsByDay(bookings: BookingDetailed[]): DayBookingCount[] {
  const grouped = new Map<string, Record<ReasonKey, number>>();

  for (const booking of bookings) {
    const dateKey = booking.booking_dt;

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, { Orçamento: 0, Reparo: 0, Retorno: 0 });
    }

    const counts = grouped.get(dateKey)!;
    const reason = booking.reason as ReasonKey;

    if (reason in counts) {
      counts[reason]++;
    }
  }

  return Array.from(grouped.entries()).map(([date, counts]) => ({ date, counts }));
}

function buildCalendarEvents(dayCounts: DayBookingCount[]): EventInput[] {
  const events: EventInput[] = [];

  for (const { date, counts } of dayCounts) {
    for (const reason of Object.keys(REASON_LABELS) as ReasonKey[]) {
      const count = counts[reason];
      if (count > 0) {
        events.push({
          title: `${reason}: ${count}`,
          date,
          backgroundColor: REASON_COLORS[reason],
          borderColor: REASON_COLORS[reason],
          textColor: '#fff',
          display: 'block',
        });
      }
    }
  }

  return events;
}

export function CalendarPage() {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState<BookingDetailed[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  // Filters state
  const [filterReason, setFilterReason] = useState<string>('');
  const [filterService, setFilterService] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');

  const fetchBookingsForMonth = useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    try {
      const data = await getDetailedBookingsByMonth(year, month);
      setAllBookings(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setAllBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const entriesToDisplay = useMemo(() => {
    return allBookings.filter(booking => {
      if (filterReason && booking.reason !== filterReason) return false;
      if (filterService && booking.service !== filterService) return false;
      return true;
    });
  }, [allBookings, filterReason, filterService]);

  const events = useMemo(() => {
    const dayCounts = groupBookingsByDay(entriesToDisplay);
    return buildCalendarEvents(dayCounts);
  }, [entriesToDisplay]);

  const handleDatesSet = useCallback((dateInfo: DatesSetArg) => {
    const midDate = new Date(
      (dateInfo.start.getTime() + dateInfo.end.getTime()) / 2
    );
    const year = midDate.getFullYear();
    const month = midDate.getMonth() + 1;
    fetchBookingsForMonth(year, month);
  }, [fetchBookingsForMonth]);

  const handleDateClick = useCallback((info: DateClickArg) => {
    navigate(`${BOOKINGS_ROUTE_PREFIX}/${info.dateStr}`);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    navigate(LOGIN_ROUTE);
  }, [navigate]);

  const handleGotoDate = useCallback(() => {
    if (searchDate && calendarRef.current) {
      calendarRef.current.getApi().gotoDate(searchDate);
    }
  }, [searchDate]);

  useEffect(() => {
    const now = new Date();
    fetchBookingsForMonth(now.getFullYear(), now.getMonth() + 1);
  }, [fetchBookingsForMonth]);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#131313]/90 backdrop-blur-xl border-b border-[#d4af37]/15">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f2ca50] text-2xl">
              calendar_month
            </span>
            <h1 className="font-['Space_Grotesk'] text-lg font-bold tracking-wide uppercase text-[#f2ca50]">
              Calendário de Agendamentos
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f2ca50] text-[#1c1b1b] text-sm font-bold shadow-[0_0_15px_rgba(242,202,80,0.2)] hover:bg-[#e6bf3d] hover:shadow-[0_0_20px_rgba(242,202,80,0.3)] transition-all uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Novo
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#d0c5af] text-sm font-medium hover:border-red-400/40 hover:text-red-400 transition-all"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Calendar Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Filters Panel */}
        <div className="glass-effect rounded-2xl p-5 border border-[#d4af37]/10 mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-[#d0c5af] uppercase tracking-[0.1em] mb-2">
              Motivo
            </label>
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#e5e2e1] focus:border-[#f2ca50]/50 transition-colors"
            >
              <option value="">Todos</option>
              {Object.keys(REASON_LABELS).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-[#d0c5af] uppercase tracking-[0.1em] mb-2">
              Serviço
            </label>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#e5e2e1] focus:border-[#f2ca50]/50 transition-colors"
            >
              <option value="">Todos</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-[#d0c5af] uppercase tracking-[0.1em] mb-2">
              Ir para Data
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#e5e2e1] focus:border-[#f2ca50]/50 transition-colors"
              />
              <button 
                onClick={handleGotoDate}
                className="px-4 py-2 rounded-xl bg-[#f2ca50] text-[#1c1b1b] font-bold"
              >
                <span className="material-symbols-outlined text-base">search</span>
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 mb-4 text-[#d0c5af] text-sm">
            <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
            Carregando agendamentos...
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 px-2">
          {(Object.keys(REASON_LABELS) as ReasonKey[]).map((reason) => (
            <div key={reason} className="flex items-center gap-2 text-sm font-medium">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: REASON_COLORS[reason] }}
              />
              <span className="text-[#d0c5af]">{REASON_LABELS[reason]}</span>
            </div>
          ))}
        </div>

        {/* FullCalendar */}
        <div className="calendar-wrapper glass-effect rounded-2xl p-4 border border-[#d4af37]/10">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            events={events}
            datesSet={handleDatesSet}
            dateClick={handleDateClick}
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'next',
            }}
            height="auto"
            dayMaxEvents={3}
            fixedWeekCount={false}
          />
        </div>
      </main>
    </div>
  );
}
