'use client';

import Link from 'next/link';
import { Building2, TrendingUp, TrendingDown, Minus, Shield, Percent, Star, Award, XCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type BancoRaioX, getHealthStatus } from '@/lib/bcb-api';

interface BankCardProps {
  banco: BancoRaioX;
}

function slugify(nome: string) {
  return nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function BankCard({ banco }: BankCardProps) {
  const isLiquidado = banco.fonte_dados?.includes('LIQUIDADO') || banco.score === 0;
  const healthStatus = getHealthStatus(banco);

  const statusConfig = {
    excellent: { label: 'Excelente', color: 'bg-accent text-accent-foreground' },
    good: { label: 'Bom', color: 'bg-primary text-primary-foreground' },
    warning: { label: 'Atencao', color: 'bg-yellow-500 text-black' },
    danger: { label: 'Critico', color: 'bg-destructive text-destructive-foreground' },
  };

  const config = statusConfig[healthStatus];
  const hasRating = banco.rating_moodys || banco.rating_fitch || banco.rating_sp;

  return (
    <Link href={`/banco/${slugify(banco.nome)}`}>
      <Card className={cn(
        'group relative h-full transition-all hover:shadow-lg',
        isLiquidado
          ? 'border-destructive/30 opacity-75 hover:border-destructive/50 hover:opacity-100 hover:shadow-destructive/10'
          : 'hover:border-primary/50 hover:shadow-primary/5'
      )}>
        {/* Liquidado overlay */}
        {isLiquidado && (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-destructive px-2 py-1 text-[10px] font-bold text-white">
            <XCircle className="h-3 w-3" /> LIQUIDADO
          </div>
        )}

        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', isLiquidado ? 'bg-destructive/10' : 'bg-secondary')}>
              <Building2 className={cn('h-5 w-5', isLiquidado ? 'text-destructive' : 'text-primary')} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">{banco.nome}</CardTitle>
              <p className="text-xs text-muted-foreground">{banco.tipo}</p>
            </div>
          </div>
          {!isLiquidado && (
            <Badge className={cn('text-xs', config.color)}>{config.label}</Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Star className="h-3.5 w-3.5" /><span>Score</span></div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-semibold text-foreground">{banco.score}/100</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Shield className="h-3.5 w-3.5" /><span>Basileia</span></div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-semibold text-foreground">{banco.basileia.toFixed(1)}%</span>
                {!isLiquidado && <TrendingIndicator value={banco.basileia} threshold={12} />}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Percent className="h-3.5 w-3.5" /><span>Imobilizacao</span></div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-semibold text-foreground">{banco.imobilizacao.toFixed(1)}%</span>
                {!isLiquidado && <TrendingIndicator value={banco.imobilizacao} threshold={30} inverted />}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Award className="h-3.5 w-3.5" /><span>Rating</span></div>
              <div className="flex flex-wrap gap-1">
                {hasRating ? (
                  <>
                    {banco.rating_moodys && <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-foreground">M: {banco.rating_moodys}</span>}
                    {banco.rating_fitch && <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-foreground">F: {banco.rating_fitch}</span>}
                    {banco.rating_sp && <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-foreground">S&P: {banco.rating_sp}</span>}
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">N/D</span>
                )}
              </div>
            </div>
          </div>

          {/* Ver detalhes */}
          <div className="mt-4 flex items-center justify-end gap-1 text-xs text-primary opacity-0 transition group-hover:opacity-100">
            Ver detalhes <ArrowRight className="h-3 w-3" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TrendingIndicator({ value, threshold, inverted = false }: { value: number; threshold: number; inverted?: boolean }) {
  const isGood = inverted ? value < threshold : value > threshold;
  const isNeutral = Math.abs(value - threshold) < threshold * 0.1;
  if (isNeutral) return <Minus className="h-4 w-4 text-muted-foreground" />;
  if (isGood) return <TrendingUp className="h-4 w-4 text-accent" />;
  return <TrendingDown className="h-4 w-4 text-destructive" />;
}
