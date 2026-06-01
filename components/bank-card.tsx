import { Building2, TrendingUp, TrendingDown, Minus, Shield, Percent, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type ResumoIndicadores, formatCurrency, getHealthStatus } from '@/lib/bcb-api';

interface BankCardProps {
  banco: ResumoIndicadores;
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

  return (
    <Card className="group transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              {banco.instituicao}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Segmento {banco.segmento} • {banco.dataBase}
            </p>
          </div>
        </div>
        <Badge className={cn('text-xs', config.color)}>
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Taxa de Imobilização */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Percent className="h-3.5 w-3.5" />
              <span>Taxa Imobilização</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-foreground">
                {banco.taxaImobilizacao !== null ? `${banco.taxaImobilizacao.toFixed(1)}%` : 'N/D'}
              </span>
              {banco.taxaImobilizacao !== null && (
                <TrendingIndicator value={banco.taxaImobilizacao} threshold={30} inverted />
              )}
            </div>
          </div>

          {/* Índice de Basileia */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span>Índice Basileia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-foreground">
                {banco.indiceBasileia !== null ? `${banco.indiceBasileia.toFixed(1)}%` : 'N/D'}
              </span>
              {banco.indiceBasileia !== null && (
                <TrendingIndicator value={banco.indiceBasileia} threshold={12} />
              )}
            </div>
          </div>

          {/* ROE */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>ROE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-foreground">
                {banco.roe !== null ? `${banco.roe.toFixed(1)}%` : 'N/D'}
              </span>
              {banco.roe !== null && (
                <TrendingIndicator value={banco.roe} threshold={15} />
              )}
            </div>
          </div>

          {/* Ativo Total */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Ativo Total</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-semibold text-foreground">
                {banco.ativoTotal !== null ? formatCurrency(banco.ativoTotal) : 'N/D'}
              </span>
            </div>
          </div>
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

  if (isNeutral) {
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  }

  if (isGood) {
    return <TrendingUp className="h-4 w-4 text-accent" />;
  }

  return <TrendingDown className="h-4 w-4 text-destructive" />;
}
