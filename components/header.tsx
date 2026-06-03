'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Radar, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Radar className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Radar <span className="text-primary">Bancario</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Início</Link>
          <Link href="/bancos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Bancos</Link>
          <Link href="/comparar" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Comparar</Link>
          <Link href="/#indicadores" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Indicadores</Link>
          <Link href="/#sobre" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Sobre</Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-2 p-4">
            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary" onClick={() => setIsMenuOpen(false)}>Início</Link>
            <Link href="/bancos" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setIsMenuOpen(false)}>Bancos</Link>
            <Link href="/comparar" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setIsMenuOpen(false)}>Comparar</Link>
            <Link href="/#indicadores" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setIsMenuOpen(false)}>Indicadores</Link>
            <div className="mt-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
