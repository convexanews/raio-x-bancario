'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Menu, X, TrendingUp, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, LoginGate } from '@/components/login-gate';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout } = useUser();

  return (
    <>
      {showLogin && <LoginGate onClose={() => setShowLogin(false)} />}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Raio X <span className="text-primary">Bancario</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Inicio</Link>
            <Link href="/#bancos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Bancos</Link>
            <Link href="/#indicadores" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Indicadores</Link>
            <Link href="/#sobre" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Sobre</Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-medium text-primary">Ola, {user.nome.split(' ')[0]}</span>
                </div>
                <button onClick={logout} className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground" title="Sair">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button size="sm" className="gap-2" onClick={() => setShowLogin(true)}>
                <TrendingUp className="h-4 w-4" />
                Acessar
              </Button>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="flex flex-col gap-2 p-4">
              <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
              <Link href="/#bancos" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setIsMenuOpen(false)}>Bancos</Link>
              <Link href="/#indicadores" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setIsMenuOpen(false)}>Indicadores</Link>
              <div className="mt-2">
                {user ? (
                  <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
                    <span className="text-sm font-medium text-primary">Ola, {user.nome.split(' ')[0]}</span>
                    <button onClick={logout} className="text-xs text-muted-foreground">Sair</button>
                  </div>
                ) : (
                  <Button className="w-full gap-2" onClick={() => { setShowLogin(true); setIsMenuOpen(false); }}>
                    <TrendingUp className="h-4 w-4" />
                    Acessar
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
