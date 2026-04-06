import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { DatesSetArg, EventInput } from '@fullcalendar/core';
import { getBookingsByMonth } from '../../services/booking_service';
import type { Booking } from '../../types/booking';

const AUTH_STORAGE_KEY = 'manager_auth';
const LOGIN_ROUTE = '/admin';
const BOOKINGS_ROUTE_PREFIX = '/manager/bookings';

const REASON_LABELS = {
  Orçamento: 'Orçamento',
  Reparo: 'Reparo',
  Retorno: 'Retorno',
} as const;

type ReasonKey = keyof typeof REASON_LABELS;

const REASON_COLORS: Record<ReasonKey, string> = {
  Orçamento: '#3b82f6',
  Reparo: '#22c55e',
  Retorno: '#eab308',
};

interface DayBookingCount {
  date: string;
  counts: Record<ReasonKey, number>;
}

function groupBookingsByDay(bookings: Booking[]): DayBookingCount[] {
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
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookingsForMonth = useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    try {
      const bookings = await getBookingsByMonth(year, month);
      const dayCounts = groupBookingsByDay(bookings);
      const calendarEvents = buildCalendarEvents(dayCounts);
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  useEffect(() => {
    const now = new Date();
    fetchBookingsForMonth(now.getFullYear(), now.getMonth() + 1);
  }, [fetchBookingsForMonth]);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#131313]/90 backdrop-blur-xl border-b border-[#d4af37]/15">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#f2ca50] text-2xl">
              calendar_month
            </span>
            <h1 className="font-['Space_Grotesk'] text-lg font-bold tracking-wide uppercase text-[#f2ca50]">
              Calendário de Agendamentos
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#d0c5af] text-sm font-medium hover:border-red-400/40 hover:text-red-400 transition-all"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Sair
          </button>
        </div>
      </header>

      {/* Calendar Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 mb-4 text-[#d0c5af] text-sm">
            <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
            Carregando agendamentos...
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          {(Object.keys(REASON_LABELS) as ReasonKey[]).map((reason) => (
            <div key={reason} className="flex items-center gap-2 text-sm">
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
