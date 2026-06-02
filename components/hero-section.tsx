import { ArrowRight, Shield, BarChart3, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  atualizadoEm: string;
  totalBancos: number;
}

export function HeroSection({ atualizadoEm, totalBancos }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Shield className="h-4 w-4" />
            <span>Dados oficiais do Banco Central — {atualizadoEm}</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Analise a{' '}
            <span className="text-primary">saúde financeira</span>{' '}
            dos bancos brasileiros
          </h1>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Acesse indicadores como taxa de imobilização, índice de Basileia, ratings internacionais e score de saúde.
            Tome decisões informadas sobre onde depositar seu dinheiro.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 text-base" asChild>
              <a href="#bancos">
                Ver Ranking dos Bancos
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
              <p className="mt-2 text-sm text-muted-foreground">Indicadores e ratings analisados</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-center gap-2 text-chart-3">
                <Shield className="h-5 w-5" />
                <span className="text-3xl font-bold">100%</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Dados oficiais do IF.data BCB</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
