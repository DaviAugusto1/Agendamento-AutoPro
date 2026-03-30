import { useNavigate } from 'react-router-dom';
import { Layout } from '../Components/Layout';
import { useBookingContext } from '../context/BookingContext';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale/pt-BR";
import { useEffect, useState, useMemo, useRef } from "react";
import { getUnavailableTimes } from "../services/booking_service";
import { api } from "../api/api";
import { Modal } from '../Components/Modal';
import { StepProgress } from '../Components/StepProgress';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const REASON_TOOLTIPS: Record<string, string> = {
  Orçamento:
    "Agende uma visita para receber uma avaliação detalhada dos serviços necessários e um orçamento sem compromisso.",
  Reparo:
    "Traga seu veículo para realizarmos o serviço já aprovado. Certifique-se de ter o orçamento confirmado antes de agendar.",
  Retorno:
    "Agende um retorno para verificarmos o serviço realizado e garantirmos que tudo está dentro dos padrões de qualidade.",
};

registerLocale("pt-BR", ptBR);

export function BookingStep() {
  const navigate = useNavigate();
  const { formData, setFormData } = useBookingContext();
  const [modal, setModal] = useState<{isOpen: boolean, title: string, message: string, type: 'info'|'error'|'success'|'warning', onCloseAction?: () => void}>({ isOpen: false, title: '', message: '', type: 'info' });
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [blockedDates, setBlockedDates] = useState<{ Martelinho: string[], Pintura: string[][] }>({ Martelinho: [], Pintura: [] });

  useEffect(() => {
    if (!formData.service || formData.reason !== "Reparo") {
      setBlockedDates({ Martelinho: [], Pintura: [] });
      return;
    }
    async function fetchBlockedDates() {
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/invalid_repair_days?service=${formData.service}`);
        const data = await response.json();
        setBlockedDates(data);
      } catch (error) {
        console.error("Erro ao buscar datas bloqueadas:", error);
      }
    }
    fetchBlockedDates();
  }, [formData.service, formData.reason]);

  const martelinhoBlocked = useMemo(() => {
    return blockedDates.Martelinho.map((date: string) => new Date(date + "T00:00:00"));
  }, [blockedDates]);

  const pinturaIntervals = useMemo(() => {
    return blockedDates.Pintura.map((range: string[]) => {
      return { start: new Date(range[0]), end: new Date(range[1]) };
    });
  }, [blockedDates]);

  const timeInterval = useMemo(() => {
    if (formData.reason === "Orçamento") return 15;
    if (formData.reason === "Reparo") return 30;
    if (formData.reason === "Retorno") return 30;
    return 30;
  }, [formData.reason]);

  const [blockedTimeRanges, setBlockedTimeRanges] = useState<string[][]>([]);

  useEffect(() => {
    if (!formData.booking_dt) return;
    async function fetchTimes() {
      try {
        const data = await getUnavailableTimes(formData.booking_dt);
        setBlockedTimeRanges(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTimes();
  }, [formData.booking_dt]);

  const blockedRangesFormatted = useMemo(() => {
    if (!selectedDate) return [];
    return blockedTimeRanges.map(([start, end]) => {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      const startDate = new Date(selectedDate);
      startDate.setHours(sh, sm, 0);
      const endDate = new Date(selectedDate);
      endDate.setHours(eh, em, 0);
      return { start: startDate, end: endDate };
    });
  }, [blockedTimeRanges, selectedDate]);

  const filterTime = (time: Date) => {
    const timeMinutes = time.getHours() * 60 + time.getMinutes();
    for (const range of blockedRangesFormatted) {
      const startMinutes = range.start.getHours() * 60 + range.start.getMinutes();
      const endMinutes = range.end.getHours() * 60 + range.end.getMinutes();
      if (timeMinutes >= startMinutes && timeMinutes <= endMinutes) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setSelectedDate(null);
    setFormData((prev) => ({ ...prev, booking_dt: "" }));
  }, [formData.reason, setFormData]);

  const generateAvailableTimes = () => {
    const times: Date[] = [];
    const start = new Date();
    start.setHours(8, 30, 0);
    const end = new Date();
    end.setHours(17, 0, 0);
    while (start <= end) {
      times.push(new Date(start));
      start.setMinutes(start.getMinutes() + timeInterval);
    }
    return times;
  };

  const availableTimes = useMemo(() => {
    return generateAvailableTimes();
  }, [timeInterval]);

  const maxTwoMonthsDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d;
  }, []);

  const isBrazilianHoliday = (date: Date) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const holidays = [
      "1-1", "21-4", "1-5", "7-9", "12-10", "2-11", "15-11", "25-12",
      "16-2", "17-2", "3-4", "4-6" 
    ];
    return holidays.includes(`${d}-${m}`);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.service) { setModal({ isOpen: true, title: 'Atenção', message: 'Selecione o Serviço!', type: 'error' }); return; }
    if (!formData.reason) { setModal({ isOpen: true, title: 'Atenção', message: 'Selecione o motivo do agendamento!', type: 'error' }); return; }
    if (!formData.booking_dt) { setModal({ isOpen: true, title: 'Atenção', message: 'Selecione a data do agendamento!', type: 'error' }); return; }
    if (!formData.booking_hr) { setModal({ isOpen: true, title: 'Atenção', message: 'Selecione o horário do agendamento!', type: 'error' }); return; }

    try {
      const custRes = await api.post('/customer/', { name: formData.customer_name, phone_number: formData.phone_number });
      
      const carRes = await api.post('/car_details/', { 
        brand_id: formData.brand_id, 
        car_model: formData.car_model, 
        car_color: formData.car_color, 
        car_year: Number(formData.car_year) 
      });

      const bkRes = await api.post('/bookings/', {
        details_id: carRes.data.details_id,
        reason: formData.reason,
        service: formData.service,
        car_plate: formData.car_plate,
        booking_dt: formData.booking_dt,
        booking_hr: formData.booking_hr
      });

      await api.post('/customer_bookings/', {
        booking_id: bkRes.data.booking_id,
        customer_id: custRes.data.customer_id
      });

      setModal({
        isOpen: true,
        title: 'Sucesso!',
        message: 'Agendamento Finalizado com Sucesso!',
        type: 'success',
        onCloseAction: () => {
          setFormData({
            customer_name: "", phone_number: "", brand_id: null, car_model: "", car_color: "", car_year: "", 
            car_plate: "", reason: "", service: "", booking_dt: "", booking_hr: ""
          });
          navigate('/');
        }
      });
      
    } catch (error) {
      console.error(error);
      setModal({ isOpen: true, title: 'Erro', message: 'Erro ao finalizar agendamento.', type: 'error' });
    }
  }

  const services = ["Martelinho de ouro", "Pintura e(ou) Funilaria"];
  const reasons = ["Orçamento", "Reparo", "Retorno"];

  return (
    <Layout>
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col items-center">
        <StepProgress currentStep={3} />

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form className="lg:col-span-7 space-y-8 bg-surface-container-low p-8 rounded-xl relative overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.4)]" 
                onSubmit={handleSubmit}>
            <div className="absolute top-0 left-0 w-full h-1 bg-surface-variant">
              <div className="h-full bg-gradient-to-r from-primary-container to-primary w-full"></div>
            </div>

            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-3">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Serviço</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map(srv => (
                    <button 
                      type="button" 
                      key={srv}
                      onClick={() => setFormData({ ...formData, service: srv })}
                      className={`px-4 py-4 rounded-xl font-headline text-sm border transition-all duration-300 text-center ${
                        formData.service === srv 
                          ? 'bg-primary border-primary text-on-primary shadow-[0_0_15px_rgba(242,202,80,0.3)]' 
                          : 'bg-surface-container-highest border-outline-variant/20 text-on-surface hover:border-primary/50 hover:bg-surface-container-highest/80'
                      }`}
                    >
                      {srv === 'Martelinho de ouro' ? 'Martelinho de Ouro' : srv}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Motivo do Agendamento</label>
                  <div className="relative" ref={tooltipRef}>
                    <button
                      type="button"
                      aria-label="Informações sobre motivo do agendamento"
                      onClick={() => setTooltipOpen(prev => !prev)}
                      onBlur={() => setTimeout(() => setTooltipOpen(false), 150)}
                      className="flex items-center justify-center w-4 h-4 rounded-full bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '12px', lineHeight: 1 }}>question_mark</span>
                    </button>
                    {tooltipOpen && (
                      <div
                        role="tooltip"
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-64 p-3 rounded-xl bg-surface-container-highest border border-outline-variant/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-on-surface"
                      >
                        {formData.reason ? (
                          <>
                            <p className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-1">{formData.reason}</p>
                            <p className="font-body text-xs text-on-surface-variant leading-relaxed">{REASON_TOOLTIPS[formData.reason]}</p>
                          </>
                        ) : (
                          <div className="space-y-3">
                            {Object.entries(REASON_TOOLTIPS).map(([reason, desc]) => (
                              <div key={reason}>
                                <p className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-0.5">{reason}</p>
                                <p className="font-body text-xs text-on-surface-variant leading-relaxed">{desc}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {reasons.map(rsn => (
                    <button 
                      type="button" 
                      key={rsn}
                      onClick={() => setFormData({ ...formData, reason: rsn })}
                      className={`px-4 py-4 rounded-xl font-headline text-sm border transition-all duration-300 text-center ${
                        formData.reason === rsn 
                          ? 'bg-primary border-primary text-on-primary shadow-[0_0_15px_rgba(242,202,80,0.3)]' 
                          : 'bg-surface-container-highest border-outline-variant/20 text-on-surface hover:border-primary/50 hover:bg-surface-container-highest/80'
                      }`}
                    >
                      {rsn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex flex-col gap-3">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Data da Visita</label>
                  <div className="w-full relative custom-datepicker-container">
                    <DatePicker
                      inline
                      selected={selectedDate}
                      onChange={(date: Date | null) => {
                        setSelectedDate(date);
                        setFormData({
                          ...formData,
                          booking_dt: date?.toISOString().split("T")[0] || ""
                        });
                      }}
                      dateFormat="dd/MM/yyyy"
                      locale="pt-BR"
                      minDate={new Date()}
                      maxDate={maxTwoMonthsDate}
                      filterDate={(date: Date) => {
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        if (isWeekend) return false;
                        if (isBrazilianHoliday(date)) return false;
                        return true;
                      }}
                      excludeDates={formData.service === "Martelinho de ouro" && formData.reason === "Reparo" ? martelinhoBlocked : []}
                      excludeDateIntervals={formData.service === "Pintura e(ou) Funilaria" && formData.reason === "Reparo" ? pinturaIntervals : []}
                      disabled={!formData.service || !formData.reason}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Horário Disponível</label>
                  <div className="w-full relative custom-datepicker-container">
                    <DatePicker
                      inline
                      selected={selectedTime}
                      onChange={(time: Date | null) => {
                        setSelectedTime(time);
                        setFormData({
                          ...formData,
                          booking_hr: time ? `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}` : ""
                        });
                      }}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={timeInterval}
                      timeCaption="Horário"
                      timeFormat="HH:mm"
                      dateFormat="HH:mm"
                      locale="pt-BR"
                      includeTimes={availableTimes}
                      filterTime={filterTime}
                      disabled={!formData.booking_dt}
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 mt-8 border-t border-outline-variant/10">
              <button type="button" onClick={() => navigate('/car')} className="group flex items-center gap-3 text-on-surface-variant hover:text-on-surface transition-colors order-2 sm:order-1">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span className="font-label text-xs uppercase tracking-widest font-bold">Voltar</span>
              </button>
              <button type="submit" disabled={!formData.booking_dt || !formData.booking_hr || !formData.service || !formData.reason} className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary font-headline font-bold uppercase tracking-widest rounded-md hover:bg-primary-fixed-dim hover:shadow-[0_0_20px_rgba(242,202,80,0.4)] transition-all active:scale-95 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Finalizar
              </button>
            </div>
          </form>

          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-video w-full rounded-xl overflow-hidden relative group bg-surface-container-high border border-outline-variant/10">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbCWOJrrcHHPMlE8xcwqW9gbA5kp_eu8NwkkBl4XYdO0YKqjfjX0fg2TS3-mH05KWfqmrcXAQiKIr18NY_h_l-iQCbR6GFVfn0KtVwAB0DMDtVuTyXUqH1xFTfHJbN5Qu3Vw0nHLG8AAlgS3GEpI9H3_QTHXkxMNQ8bMEVTctOzjgOjioK4Spnkd6VXVF0uXmkGPLiCLdDm1ZIIIZ8LHUuWPhVBnpD0zWQXBA5115s65oV-x_O-Z8p7LqMGH8aeSO0tQy0-nJrZwQm" 
                   className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Supercar profile" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="font-headline text-xl font-bold text-primary tracking-tight">KINETIC PREVIEW</h3>
                <p className="font-body text-xs text-on-surface-variant">Confirmação de Slot Reservado</p>
              </div>
            </div>

            <div className="bg-surface-container-high p-8 rounded-xl border border-outline-variant/5 shadow-[0_24px_48px_rgba(0,0,0,0.4)] space-y-6">
              <h4 className="font-headline text-sm font-bold tracking-widest uppercase text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">fact_check</span>
                Resumo do Pedido
              </h4>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                  <span className="font-label text-[10px] uppercase text-on-surface-variant">Serviço</span>
                  <span className="font-body text-sm text-on-surface font-medium text-right">{formData.service || "A definir"}</span>
                </li>
                <li className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                  <span className="font-label text-[10px] uppercase text-on-surface-variant">Motivo</span>
                  <span className="font-body text-sm text-on-surface font-medium text-right">{formData.reason || "A definir"}</span>
                </li>
                <li className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                  <span className="font-label text-[10px] uppercase text-on-surface-variant">Data da Visita</span>
                  <span className="font-body text-sm text-on-surface font-medium text-right">{formData.booking_dt ? `${formData.booking_dt} | ${formData.booking_hr}` : "A definir"}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-label text-[10px] uppercase text-on-surface-variant">Veículo</span>
                  <span className="font-body text-sm text-on-surface font-medium text-right">{formData.car_model || "A definir"}</span>
                </li>
              </ul>
              <div className="p-4 bg-surface-container-lowest border border-primary/20 rounded">
                <p className="font-body text-[10px] text-on-surface-variant leading-relaxed italic">
                  "Todos os serviços no Atelier seguem os padrões FIA de segurança e performance mecânica."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal isOpen={modal.isOpen} onClose={() => { setModal({ ...modal, isOpen: false }); if (modal.onCloseAction) modal.onCloseAction(); }} title={modal.title} message={modal.message} type={modal.type} />
    </Layout>
  );
}
