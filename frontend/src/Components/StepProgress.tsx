import { useNavigate } from 'react-router-dom';

interface StepProgressProps {
  currentStep: 1 | 2 | 3;
}

export function StepProgress({ currentStep }: Readonly<StepProgressProps>) {
  const navigate = useNavigate();

  const getPercentage = () => {
    if (currentStep === 1) return '33%';
    if (currentStep === 2) return '66%';
    return '100%';
  };

  const getStepTitle = () => {
    if (currentStep === 1) return 'CLIENTE';
    if (currentStep === 2) return 'CARRO';
    return 'AGENDAMENTO';
  };

  return (
    <div className="w-full max-w-3xl mb-16 mx-auto">
      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-1">
            Passo 0{currentStep}
          </span>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface uppercase">
            {getStepTitle()}
          </h1>
        </div>
      </div>
      
      <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div 
          className="h-full service-gauge-bg shadow-[0_0_15px_rgba(242,202,80,0.3)] transition-all duration-700 ease-out"
          style={{ width: getPercentage() }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-4">
        <div 
          className={`flex items-center gap-2 cursor-pointer transition-colors ${currentStep === 1 ? 'text-primary' : 'text-on-surface-variant/40 hover:text-primary'}`}
        >
          <span className="font-label text-[10px] font-bold">01</span>
          <span className={`font-label text-[10px] uppercase tracking-${currentStep === 1 ? '[0.1em] font-black' : 'tighter'}`}>CLIENTE</span>
        </div>
        <div 
          className={`flex items-center gap-2 cursor-pointer transition-colors ${currentStep === 2 ? 'text-primary' : 'text-on-surface-variant/40 hover:text-primary'}`} 
        >
          <span className="font-label text-[10px] font-bold">02</span>
          <span className={`font-label text-[10px] uppercase tracking-${currentStep === 2 ? '[0.1em] font-black' : 'tighter'}`}>CARRO</span>
        </div>
        <div 
          className={`flex items-center gap-2 cursor-pointer transition-colors ${currentStep === 3 ? 'text-primary' : 'text-on-surface-variant/40 hover:text-primary'}`} 
        >
          <span className="font-label text-[10px] font-bold">03</span>
          <span className={`font-label text-[10px] uppercase tracking-${currentStep === 3 ? '[0.1em] font-black' : 'tighter'}`}>SERVIÇO</span>
        </div>
      </div>
    </div>
  );
}
