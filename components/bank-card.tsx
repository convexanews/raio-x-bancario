'use client';

import { Building2, TrendingUp, TrendingDown, Minus, Shield, Percent, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type BancoRaioX, getHealthStatus } from '@/lib/bcb-api';

interface BankCardProps {
  banco: BancoRaioX;
}

export function BankCard({ banco }: BankCardProps) {
  const healthStatus = getHealthStatus(banco);

  const statusConfig = {
    excellent: { label: 'Excelente', color: 'bg-accent text-accent-foreground' },
    good: { label: 'Bom', color: 'bg-primary text-primary-foreground' },
    warning: { label: 'Atenção', color: 'bg-warning text-warning-foreground' },
    danger: { label: 'Crítico', color: 'bg-destructive text-destructive-foreground' },
  };

  const config = statusConfig[healthStatus];

  const hasRating = banco.rating_moodys || banco.rating_fitch || banco.rating_sp;

  return (
    <Card className="group transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              {banco.nome}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {banco.tipo}
            </p>
          </div>
        </div>
        <Badge className={cn('text-xs', config.color)}>
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Score */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5" />
              <span>Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-foreground">
                {banco.score}/100
              </span>
            </div>
          </div>

          {/* Índice de Basileia */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Basileia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-foreground">
                {banco.basileia.toFixed(1)}%
              </span>
              <TrendingIndicator value={banco.basileia} threshold={12} />
            </div>
          </div>

          {/* Taxa de Imobilização */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Percent className="h-3.5 w-3.5" />
              <span>Imobilização</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-foreground">
                {banco.imobilizacao.toFixed(1)}%
              </span>
              <TrendingIndicator value={banco.imobilizacao} threshold={30} inverted />
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Award className="h-3.5 w-3.5" />
              <span>Rating</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {hasRating ? (
                <>
                  {banco.rating_moodys && (
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-foreground">
                      M: {banco.rating_moodys}
                    </span>
                  )}
                  {banco.rating_fitch && (
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-foreground">
                      F: {banco.rating_fitch}
                    </span>
                  )}
                  {banco.rating_sp && (
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-foreground">
                      S&P: {banco.rating_sp}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">N/D</span>
              )}
            </div>
          </div>
        </div>

        {/* Perspectiva + Fonte */}
        <div className="mt-3 flex flex-col gap-1">
          {banco.rating_perspectiva && (
            <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1 text-xs text-muted-foreground">
              Perspectiva: <span className="font-medium text-foreground">{banco.rating_perspectiva}</span>
            </div>
          )}
          {banco.fonte_dados && (
            <p className="px-1 text-[10px] text-muted-foreground/60">
              Fonte: {banco.fonte_dados}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TrendingIndicator({
  value,
  threshold,
  inverted = false
}: {
  value: number;
  threshold: number;
  inverted?: boolean;
}) {
  const isGood = inverted ? value < threshold : value > threshold;
  const isNeutral = Math.abs(value - threshold) < threshold * 0.1;

  if (isNeutral) return <Minus className="h-4 w-4 text-muted-foreground" />;
  if (isGood) return <TrendingUp className="h-4 w-4 text-accent" />;
  return <TrendingDown className="h-4 w-4 text-destructive" />;
}
