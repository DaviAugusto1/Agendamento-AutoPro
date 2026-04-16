import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { confirmBooking } from '../services/booking_service';

export function BookingConfirmation() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!bookingId) {
      setStatus('error');
      return;
    }

    let isMounted = true;

    async function confirm() {
      try {
        await confirmBooking(Number(bookingId));
        if (isMounted) {
          setStatus('success');
        }
      } catch (error: any) {
        console.error("Erro ao confirmar:", error);
        
        if (error?.response?.data?.detail === "Agendamento já está confirmado" && isMounted) {
           setStatus('success'); 
           return;
        }

        if (isMounted) {
          setStatus('error');
        }
      }
    }

    // Call API with slight minimum delay to ensure the status UI is visible and feels premium
    setTimeout(() => confirm(), 1500);

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface p-6 font-body text-on-surface">
      <div className="w-full max-w-md bg-surface-container-high border border-outline-variant/20 p-10 rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.6)] text-center relative overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_rgba(0,0,0,0.8)] hover:border-primary/30 group">
        {/* Animated accent top line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-surface-variant overflow-hidden">
           <div className="h-full bg-gradient-to-r from-primary-container to-primary w-full shadow-[0_0_10px_rgba(242,202,80,0.5)]"></div>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-6 py-6">
            <span className="material-symbols-outlined text-primary animate-spin text-6xl drop-shadow-[0_0_10px_rgba(242,202,80,0.5)]">sync</span>
            <div className="space-y-3">
              <h1 className="text-primary font-headline font-bold text-2xl tracking-widest uppercase">Confirmando</h1>
              <p className="text-on-surface-variant font-body text-sm font-medium leading-relaxed">
                Por favor, aguarde enquanto validamos o seu agendamento no sistema.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6 py-6 transition-opacity duration-700 ease-in-out opacity-100">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-2 border border-primary/20 shadow-[0_0_30px_rgba(242,202,80,0.15)] relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-primary/20 opacity-75"></div>
              <span className="material-symbols-outlined text-primary text-6xl relative z-10 drop-shadow-[0_0_10px_rgba(242,202,80,0.3)]">check_circle</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-primary font-headline font-bold text-2xl tracking-widest uppercase shadow-black drop-shadow-md">Confirmado!</h1>
              <p className="text-on-surface font-body text-sm leading-relaxed px-4">
                Seu agendamento foi finalizado com sucesso. Estamos aguardando a sua visita no AutoPro Atelier!
              </p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 w-full py-4 bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-primary-fixed-dim transition-all duration-300 shadow-[0_0_15px_rgba(242,202,80,0.3)] hover:shadow-[0_0_25px_rgba(242,202,80,0.5)] hover:-translate-y-1 active:scale-95"
            >
              Voltar ao Início
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-6 py-6 transition-opacity duration-700 ease-in-out opacity-100">
            <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-2 border border-error/20 relative">
               <span className="material-symbols-outlined text-error text-6xl relative z-10 drop-shadow-[0_0_10px_rgba(255,180,171,0.3)]">error</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-error font-headline font-bold text-2xl tracking-widest uppercase drop-shadow-md">Ocorreu um Erro</h1>
              <p className="text-on-surface-variant font-body text-sm leading-relaxed px-4">
                Não foi possível confirmar o agendamento. O link pode ser inválido ou o processo já foi finalizado.
              </p>
            </div>
             <button 
              onClick={() => navigate('/')}
              className="mt-6 w-full py-4 bg-error/10 border border-error/50 text-error font-headline font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-error/20 transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
              Voltar ao Início
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
