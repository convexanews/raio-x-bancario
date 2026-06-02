'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, BarChart3, Database, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type BancoRaioX } from '@/lib/bcb-api';

interface HeroSectionProps {
  atualizadoEm: string;
  totalBancos: number;
  bancos: BancoRaioX[];
}

function slugify(nome: string) {
  return nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function HeroSection({ atualizadoEm, totalBancos, bancos }: HeroSectionProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const results = query.length >= 2
    ? bancos.filter(b => b.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  const handleSelect = (banco: BancoRaioX) => {
    setQuery('');
    setShowResults(false);
    router.push(`/banco/${slugify(banco.nome)}`);
  };

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Shield className="h-4 w-4" />
            <span>Dados oficiais do Banco Central &mdash; {atualizadoEm}</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Seu banco e{' '}
            <span className="text-primary">seguro</span>?
          </h1>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Descubra a saude financeira dos bancos brasileiros com dados oficiais do Banco Central, ratings internacionais e score de saude.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-10 max-w-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Digite o nome do seu banco..."
                value={query}
                onChange={e => { setQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-lg text-foreground placeholder-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {showResults && results.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                {results.map(b => (
                  <button
                    key={b.nome}
                    onMouseDown={() => handleSelect(b)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-secondary"
                  >
                    <div>
                      <span className="font-medium text-foreground">{b.nome}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{b.tipo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${b.score >= 70 ? 'bg-accent/20 text-accent' : b.score >= 50 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-destructive/20 text-destructive'}`}>
                        {b.score}/100
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 text-base" asChild>
              <a href="#bancos">
                Ver Ranking Completo
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-base" asChild>
              <a href="#indicadores">Como funciona?</a>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Database className="h-5 w-5" />
                <span className="text-3xl font-bold">{totalBancos}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Bancos analisados</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-center gap-2 text-accent">
                <BarChart3 className="h-5 w-5" />
                <span className="text-3xl font-bold">5+</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Indicadores e ratings</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-center gap-2 text-chart-3">
                <Shield className="h-5 w-5" />
                <span className="text-3xl font-bold">100%</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Dados oficiais IF.data BCB</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
