import { useNavigate } from 'react-router-dom';
import { Layout } from '../Components/Layout';
import { useBookingContext } from '../context/BookingContext';
import { useState, useEffect } from 'react';
import { getBrands } from '../services/brand_service';
import { getDetailsByPlate } from '../services/car_details_service';
import { Modal } from '../Components/Modal';
import { StepProgress } from '../Components/StepProgress';
import Select from 'react-select';
import { customSelectStyles } from '../Components/SelectStyles';

type Brand = { brand_id: number; brand_name: string };

export function CarStep() {
  const navigate = useNavigate();
  const { formData, setFormData } = useBookingContext();
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as 'info' | 'error' | 'success' | 'warning' });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [autoFilled, setAutoFilled] = useState(false);

  useEffect(() => {
    getBrands().then(data => setBrands(data));
  }, []);

  useEffect(() => {
    if (formData.car_plate?.length !== 7) return;
    async function fetchVehicle() {
      const response = await getDetailsByPlate(formData.car_plate);
      if (response) {
        setFormData(prev => ({
          ...prev,
          car_model: response.car_model,
          car_color: response.car_color,
          car_year: response.car_year,
          brand_id: response.brand_id
        }));
        setAutoFilled(true);
      } else {
        setAutoFilled(false);
      }
    }
    fetchVehicle();
  }, [formData.car_plate, setFormData]);

  useEffect(() => {
    if (formData.car_plate.length !== 7) return;
    const timeout = setTimeout(() => { getDetailsByPlate(formData.car_plate); }, 500);
    return () => clearTimeout(timeout);
  }, [formData.car_plate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.car_model) { setModal({ isOpen: true, title: 'Atenção', message: 'Digite o modelo do veículo!', type: 'error' }); return; }
    if (!formData.car_plate) { setModal({ isOpen: true, title: 'Atenção', message: 'Digite a placa do carro!', type: 'error' }); return; }
    navigate('/booking');
  }
  return (
    <Layout>
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col items-center">
        <StepProgress currentStep={2} />

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 relative hidden md:block">
            <div className="sticky top-40 aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/10">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC81DmGYkFgHopa5bhtGbgNXJILma2sjOskEeMqumklz7t5RacA4j6211n6puhN7IRlxcPbIjoWbu_sw2-BlLH82g7M6mJFaO_taOf7pfyF9acjCm7Z9xF1CnseFOsq5qmWKREbp69IkTILTrpzwO4toElb2QF-3OMQ4QqTMrqGz7xvP4-kckz5p8wOjHN-_q3sNHNVmLxKhifbIaHV_xsYZWCMNFysyFatd6LXkQgDOvpZLsguX5XfvGjww7CQmMB-jgiec63lMIY" 
                   className="w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="Dashboard" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-headline text-lg font-bold text-primary mb-2">PRECISÃO MECÂNICA</p>
                <p className="text-on-surface-variant text-sm leading-relaxed">Identificamos o seu veículo para garantir que as peças e ferramentas específicas estejam prontas para a sua chegada.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-8">
            <div className="p-8 rounded-xl bg-surface-container-low border border-outline-variant/5 shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant opacity-70">Placa do Veículo</label>
                  <input type="text" placeholder="ABC1234" required maxLength={7}
                         value={formData.car_plate}
                         onChange={(e) => {
                           const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
                           setFormData({ ...formData, car_plate: value });
                           if (value.length === 0 && autoFilled) {
                             setFormData({ ...formData, car_plate: "", car_color: "", car_year: "", brand_id: null, car_model: "" });
                             setAutoFilled(false);
                           }
                         }}
                         className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant/20 px-0 py-4 font-headline text-2xl tracking-widest text-primary focus:border-primary transition-all placeholder:text-on-surface-variant/20" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant opacity-70">Marca</label>
                    <div className="bg-surface-container-highest rounded-t-md border-b-2 border-outline-variant/20 focus-within:border-primary transition-all pt-1 px-1">
                      <Select
                        options={brands.map(b => ({ value: b.brand_id, label: b.brand_name }))}
                        styles={customSelectStyles}
                        placeholder="Selecione a marca"
                        value={brands.filter(b => b.brand_id === formData.brand_id).map(b => ({ value: b.brand_id, label: b.brand_name }))[0] || null}
                        onChange={(selected: any) => setFormData({ ...formData, brand_id: selected?.value || null })}
                        isSearchable
                        isDisabled={autoFilled}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant opacity-70">Modelo</label>
                    <input type="text" placeholder="Ex: 911 Carrera" required disabled={autoFilled}
                           value={formData.car_model} onChange={(e) => setFormData({ ...formData, car_model: e.target.value })}
                           className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant/20 px-0 py-3 font-body text-base text-on-surface focus:border-primary transition-all placeholder:text-on-surface-variant/20 disabled:opacity-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant opacity-70">Cor</label>
                    <input type="text" placeholder="Ex: Grigio Telesto" 
                           value={formData.car_color} onChange={(e) => setFormData({ ...formData, car_color: e.target.value })}
                           className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant/20 px-0 py-3 font-body text-base text-on-surface focus:border-primary transition-all placeholder:text-on-surface-variant/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant opacity-70">Ano</label>
                    <input type="number" placeholder="2024" 
                           value={formData.car_year || ""} onChange={(e) => setFormData({ ...formData, car_year: e.target.value ? Number(e.target.value) : "" })}
                           className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant/20 px-0 py-3 font-body text-base text-on-surface focus:border-primary transition-all placeholder:text-on-surface-variant/20" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
                  <button type="button" onClick={() => navigate('/')} className="group flex items-center gap-3 text-on-surface-variant hover:text-on-surface transition-colors order-2 sm:order-1">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    <span className="font-label text-xs uppercase tracking-widest font-bold">Voltar</span>
                  </button>
                  <button type="submit" disabled={!formData.car_plate || !formData.car_model} className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary font-headline font-bold uppercase tracking-widest rounded-md hover:bg-primary-fixed-dim hover:shadow-[0_0_20px_rgba(242,202,80,0.4)] transition-all active:scale-95 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    Próximo
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-surface-container-low/50 border-l-2 border-primary/30">
              <span className="material-symbols-outlined text-primary text-xl">info</span>
              <p className="text-xs text-on-surface-variant leading-relaxed font-label">
                Não encontrou seu modelo? Não se preocupe. Preencha o mais próximo possível e detalhe no próximo passo ou fale diretamente com um especialista através do Vault.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} message={modal.message} type={modal.type} />
    </Layout>
  );
}
