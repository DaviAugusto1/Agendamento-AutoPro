import React, { useState, useEffect } from 'react';
import type { BookingDetailed } from '../../types/booking';
import { updateBooking } from '../../services/booking_service';
import { REASON_LABELS, SERVICES } from '../../constants/bookingConstants';

interface ManagerEditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetailed | null;
  onSuccess: () => void; // Trigger list refresh
}

export function ManagerEditBookingModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}: Readonly<ManagerEditBookingModalProps>) {
  const [reason, setReason] = useState(booking?.reason || '');
  const [service, setService] = useState(booking?.service || '');
  const [carPlate, setCarPlate] = useState(booking?.car_plate || '');
  const [bookingDt, setBookingDt] = useState(booking?.booking_dt || '');
  const [bookingHr, setBookingHr] = useState(booking?.booking_hr || '');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state when new booking selected
  useEffect(() => {
    if (booking) {
      setReason(booking.reason || '');
      setService(booking.service || '');
      setCarPlate(booking.car_plate || '');
      setBookingDt(booking.booking_dt || '');
      setBookingHr(booking.booking_hr || '');
    }
    setErrorMsg('');
  }, [booking, isOpen]);

  if (!isOpen || !booking) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await updateBooking(booking.booking_id, {
        reason,
        service: service || undefined,
        car_plate: carPlate,
        booking_dt: bookingDt,
        booking_hr: bookingHr,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao editar o agendamento.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/80 backdrop-blur-sm transition-all duration-300">
      <div className="glass-effect rounded-2xl w-full max-w-md border border-[#d4af37]/20 shadow-[0_8px_32px_rgba(242,202,80,0.1)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1c1b1b] border-b border-[#d4af37]/15 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50]">edit_calendar</span>
            <h2 className="text-[#f2ca50] font-['Space_Grotesk'] font-bold text-lg uppercase tracking-wide">
              Editar Agendamento
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-[#d0c5af] hover:text-[#f2ca50] p-1 rounded-full hover:bg-[#353535]/50 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 mb-4 text-sm font-medium border rounded-lg bg-red-900/20 text-red-400 border-red-500/30 flex items-start gap-2">
               <span className="material-symbols-outlined text-[18px]">error</span>
               <span>{errorMsg}</span>
            </div>
          )}

          <div>
             <label className="block text-xs font-bold text-[#d0c5af] uppercase tracking-[0.1em] mb-2">
              Motivo
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#e5e2e1] focus:border-[#f2ca50]/50 transition-colors"
              required
            >
              {Object.keys(REASON_LABELS).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

           <div>
             <label className="block text-xs font-bold text-[#d0c5af] uppercase tracking-[0.1em] mb-2">
              Serviço
             </label>
             <select
               value={service}
               onChange={(e) => setService(e.target.value)}
               className="w-full px-4 py-2.5 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#e5e2e1] focus:border-[#f2ca50]/50 transition-colors"
             >
               <option value="">Nenhum Serviço / Orçamento</option>
               {SERVICES.map((s) => (
                 <option key={s} value={s}>{s}</option>
               ))}
             </select>
           </div>

           <div>
             <label className="block text-xs font-bold text-[#d0c5af] uppercase tracking-[0.1em] mb-2">
              Placa do Veículo
            </label>
            <input
              type="text"
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value.toUpperCase())}
              maxLength={7}
              placeholder="ABC1234 ou ABC1D23"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#e5e2e1] focus:border-[#f2ca50]/50 transition-colors uppercase font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold text-[#d0c5af] uppercase tracking-[0.1em] mb-2">
                Data
              </label>
              <input
                type="date"
                value={bookingDt}
                onChange={(e) => setBookingDt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#e5e2e1] focus:border-[#f2ca50]/50 transition-colors"
                required
              />
            </div>
            
            <div>
               <label className="block text-xs font-bold text-[#d0c5af] uppercase tracking-[0.1em] mb-2">
                Horário
              </label>
              <input
                type="time"
                value={bookingHr}
                onChange={(e) => setBookingHr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#e5e2e1] focus:border-[#f2ca50]/50 transition-colors"
                required
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider text-[#d0c5af] hover:text-white bg-transparent hover:bg-[#353535]/50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#f2ca50] text-[#1c1b1b] text-sm font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(242,202,80,0.2)] hover:bg-[#e6bf3d] hover:shadow-[0_0_20px_rgba(242,202,80,0.3)] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">save</span>
              )}
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
