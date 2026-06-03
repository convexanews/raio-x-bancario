'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { Radar } from 'lucide-react';

interface UserData {
  nome: string;
  email: string;
  telefone: string;
  registeredAt: string;
}

interface AuthContextType {
  user: UserData | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, logout: () => {} });

export function useUser() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('raiox_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = (data: UserData) => {
    localStorage.setItem('raiox_user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('raiox_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function LoginScreen({ onLogin }: { onLogin: (data: UserData) => void }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    onLogin({ nome: nome.trim(), email: email.trim(), telefone: telefone.trim(), registeredAt: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Radar className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Radar <span className="text-primary">Bancário</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">Descubra a saúde financeira dos bancos brasileiros</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h3 className="mb-1 text-lg font-semibold text-white">Crie sua conta gratuita</h3>
          <p className="mb-5 text-sm text-white/50">Cadastre-se para acessar o painel completo</p>

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
              Acessar painel
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-white/20">
            Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
