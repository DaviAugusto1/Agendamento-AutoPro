import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export function Modal({ isOpen, onClose, title, message, type = 'info' }: Readonly<ModalProps>) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-500 border-green-500/20';
      case 'error':
        return 'text-error border-error/20';
      case 'warning':
        return 'text-yellow-500 border-yellow-500/20';
      default:
        return 'text-primary border-primary/20';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="bg-surface-container-high border border-outline-variant/10 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-100 flex flex-col gap-4 relative overflow-hidden"
      >
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${type === 'error' ? 'from-error to-error-container' : type === 'success' ? 'from-green-500 to-green-300' : 'from-primary-container to-primary'}`}></div>
        
        <div className="flex items-start gap-4">
          <span className={`material-symbols-outlined text-3xl ${getTypeStyles()}`}>
            {getIcon()}
          </span>
          <div className="flex-1">
            <h3 className="font-headline text-lg font-bold text-on-surface tracking-tight mb-1">{title}</h3>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button 
            onClick={onClose}
            className={`px-8 py-3 font-headline uppercase tracking-widest text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 ${
              type === 'error' 
                ? 'bg-error text-on-error hover:bg-error/90 shadow-error/20' 
                : type === 'success'
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/20'
                : 'bg-primary text-on-primary hover:bg-primary-fixed-dim shadow-primary/20'
            }`}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
