import { useNavigate } from 'react-router-dom';
import { Layout } from '../Components/Layout';
import { useBookingContext } from '../context/BookingContext';
import { useState, useEffect, useMemo } from 'react';
import { Modal } from '../Components/Modal';
import { StepProgress } from '../Components/StepProgress';
import Select from 'react-select';
import { customSelectStyles } from '../Components/SelectStyles';

export function ClientStep() {
  const navigate = useNavigate();
  const { formData, setFormData } = useBookingContext();
  const [modal, setModal] = useState<{isOpen: boolean, title: string, message: string, type: 'info'|'error'|'success'|'warning'}>({ isOpen: false, title: '', message: '', type: 'info' });

  const [phoneDDD, setPhoneDDD] = useState("");
  const [phoneMain, setPhoneMain] = useState("");

  useEffect(() => {
    if (formData.phone_number?.length >= 2 && !phoneDDD) {
      setPhoneDDD(formData.phone_number.slice(0, 2));
      setPhoneMain(formatPhoneMain(formData.phone_number.slice(2)));
    }
  }, [formData.phone_number, phoneDDD]);

  function formatPhoneMain(value: string) {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 9)}`;
  }

  const isStepValid = useMemo(() => {
    return (
      formData.customer_name?.trim() !== "" &&
      formData.phone_number?.length === 11
    );
  }, [formData.customer_name, formData.phone_number]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.customer_name) {
      setModal({ isOpen: true, title: 'Atenção', message: 'Digite o nome do cliente!', type: 'error' });
      return;
    }
    if (!formData.phone_number || formData.phone_number.length < 11) {
      setModal({ isOpen: true, title: 'Atenção', message: 'Digite o telefone completo com DDD!', type: 'error' });
      return;
    }
    navigate('/car');
  }
  const ddds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99];
  const dddOptions = ddds.map(d => ({ value: String(d), label: String(d) }));

  return (
    <Layout>
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col items-center">
        <StepProgress currentStep={1} />

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 relative hidden md:block">
            <div className="sticky top-40 aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/10">
              <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800" 
                   className="w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="Client" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-headline text-lg font-bold text-primary mb-2">IDENTIDADE EXCLUSIVA</p>
                <p className="text-on-surface-variant text-sm leading-relaxed">Crie seu perfil no Private Client Registry para um atendimento sob medida.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-8">
            <div className="p-8 rounded-xl bg-surface-container-low border border-outline-variant/5 shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <label htmlFor="name" className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/70">
                    Nome Completo
                  </label>
                  <input type="text" id="name" placeholder="Ex: João da Silva" required maxLength={100}
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value.slice(0, 100) })}
                    className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant/20 px-4 py-4 font-headline text-xl text-primary focus:border-primary transition-all placeholder:text-on-surface-variant/20 rounded-t-md" />
                </div>
                
                <div className="space-y-4">
                  <label className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/70">
                    Telefone
                  </label>
                  <div className="flex gap-4 items-end">
                    <div className="w-32 bg-surface-container-highest rounded-t-md hover:bg-surface-container-highest/80 transition-colors pt-2 px-2 border-b-2 border-outline-variant/20 focus-within:border-primary">
                      <Select
                        options={dddOptions}
                        styles={customSelectStyles}
                        placeholder="DDD"
                        value={dddOptions.find(o => o.value === phoneDDD) || null}
                        onChange={(selected: any) => {
                          const newDDD = selected?.value || "";
                          setPhoneDDD(newDDD);
                          const rawMain = phoneMain.replace(/\D/g, "");
                          setFormData({ ...formData, phone_number: `${newDDD}${rawMain}` });
                        }}
                        isSearchable
                      />
                    </div>
                    
                    <input type="tel" placeholder="90000-0000" required
                      value={phoneMain}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
                        setPhoneMain(formatPhoneMain(raw));
                        setFormData({ ...formData, phone_number: `${phoneDDD}${raw}` });
                      }}
                      className="flex-1 bg-surface-container-highest border-0 border-b-2 border-outline-variant/20 px-4 py-4 font-headline text-xl text-primary focus:border-primary transition-all placeholder:text-on-surface-variant/20 rounded-t-md" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-8 mt-8 border-t border-outline-variant/10">
                  <button type="submit" disabled={!isStepValid} className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary font-headline font-bold uppercase tracking-widest rounded-md hover:bg-primary-fixed-dim hover:shadow-[0_0_20px_rgba(242,202,80,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group">
                    Próximo
                    <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} message={modal.message} type={modal.type} />
    </Layout>
  );
}
