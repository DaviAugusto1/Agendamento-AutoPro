import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const MANAGER_PASSWORD = import.meta.env.VITE_MANAGER_PASSWORD;
const AUTH_STORAGE_KEY = 'manager_auth';
const CALENDAR_ROUTE = '/manager/calendar';
const ERROR_MESSAGE = 'Senha incorreta';

export function ManagerLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password === MANAGER_PASSWORD) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      navigate(CALENDAR_ROUTE);
    } else {
      setError(ERROR_MESSAGE);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] px-4">
      <div className="w-full max-w-sm">
        <div className="glass-effect rounded-2xl p-8 border border-[#d4af37]/15 shadow-[0_24px_48px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-[#f2ca50] text-4xl mb-3 block">
              admin_panel_settings
            </span>
            <h1 className="font-['Space_Grotesk'] text-xl font-bold text-[#e5e2e1] tracking-wide uppercase">
              Painel Gerencial
            </h1>
            <p className="text-[#d0c5af] text-sm mt-1 opacity-70">
              Acesso restrito
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="manager-password"
                className="block text-xs font-bold text-[#d0c5af] uppercase tracking-[0.15em] mb-2"
              >
                Senha de acesso
              </label>
              <input
                id="manager-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="w-full px-4 py-3 rounded-xl bg-[#1c1b1b] border border-[#353535] text-[#e5e2e1] placeholder-[#555] focus:border-[#f2ca50]/50 transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#f2ca50] text-[#1c1b1b] font-bold text-sm uppercase tracking-[0.1em] hover:bg-[#e6bf3d] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(242,202,80,0.2)]"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
