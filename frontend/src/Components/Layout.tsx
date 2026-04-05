import type { ReactNode } from 'react';

export function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {children}

      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-[#131313]/90 backdrop-blur-xl border-t border-[#d4af37]/20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center h-20 px-6">
          <div className="flex flex-col items-center justify-center text-[#d0c5af] opacity-50 hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label text-[10px] font-bold tracking-[0.05em] uppercase">Atelier</span>
          </div>
          <div className="flex flex-col items-center justify-center text-[#d0c5af] opacity-50 hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined">directions_car</span>
            <span className="font-label text-[10px] font-bold tracking-[0.05em] uppercase">Garage</span>
          </div>
          <div className="flex flex-col items-center justify-center text-[#d4af37] scale-110">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
            <span className="font-label text-[10px] font-bold tracking-[0.05em] uppercase">Schedule</span>
          </div>
          <div className="flex flex-col items-center justify-center text-[#d0c5af] opacity-50 hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined">person</span>
            <span className="font-label text-[10px] font-bold tracking-[0.05em] uppercase">Profile</span>
          </div>
        </div>
      </nav>
    </>
  );
}
