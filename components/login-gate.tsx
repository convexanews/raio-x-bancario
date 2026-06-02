'use client';

import { useState, useEffect } from 'react';
import { Activity, X } from 'lucide-react';

interface UserData {
  nome: string;
  email: string;
  telefone: string;
  registeredAt: string;
}

export function useUser() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('raiox_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const login = (data: UserData) => {
    localStorage.setItem('raiox_user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('raiox_user');
    setUser(null);
  };

  return { user, login, logout };
}

export function LoginGate({ onClose }: { onClose: () => void }) {
  const { login } = useUser();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 400);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nome.trim() || nome.trim().length < 3) e.nome = 'Informe seu nome completo';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Informe um e-mail valido';
    if (!telefone.trim() || telefone.replace(/\D/g, '').length < 10) e.telefone = 'Informe seu telefone';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    login({ nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), registeredAt: new Date().toISOString() });
    close();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${closing ? 'opacity-0' : 'animate-in fade-in'}`}>
      <button onClick={close} className="absolute right-4 top-4 rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white">
        <X className="h-5 w-5" />
      </button>

      <div className="mx-4 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Activity className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Raio X <span className="text-primary">Bancario</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">Analise a saude financeira dos bancos brasileiros</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h3 className="mb-1 text-lg font-semibold text-white">Acesse o painel</h3>
          <p className="mb-5 text-sm text-white/50">Cadastre-se para acompanhar indicadores e ratings</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Nome completo *"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition ${errors.nome ? 'border-red-400' : 'border-white/10 focus:border-white/30'}`}
              />
              {errors.nome && <p className="mt-1 text-xs text-red-400">{errors.nome}</p>}
            </div>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Seu melhor e-mail *"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition ${errors.email ? 'border-red-400' : 'border-white/10 focus:border-white/30'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>
            <div className="mb-5">
              <input
                type="tel"
                placeholder="WhatsApp / Telefone *"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition ${errors.telefone ? 'border-red-400' : 'border-white/10 focus:border-white/30'}`}
              />
              {errors.telefone && <p className="mt-1 text-xs text-red-400">{errors.telefone}</p>}
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-85">
              Entrar
            </button>
          </form>
        </div>

        <button onClick={close} className="mx-auto mt-4 block text-xs text-white/30 transition hover:text-white/60">
          Continuar sem cadastro &rarr;
        </button>
      </div>
    </div>
  );
}
