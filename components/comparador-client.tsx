'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { X, Plus, ArrowLeft, TrendingUp, TrendingDown, Minus, Shield, Building2, ChevronDown } from 'lucide-react';
import { type BancoRaioX, formatCurrency } from '@/lib/bcb-api';

function slugify(nome: string) {
  return nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function fmt(v: number | undefined, suffix = '%', decimals = 1) {
  if (!v || v === 0) return 'N/D';
  return `${v.toFixed(decimals)}${suffix}`;
}

function fmtMoeda(v: number | undefined) {
  if (!v || v === 0) return 'N/D';
  if (v >= 1e12) return `R$ ${(v / 1e12).toFixed(2)} tri`;
  if (v >= 1e9) return `R$ ${(v / 1e9).toFixed(1)} bi`;
  return `R$ ${(v / 1e6).toFixed(0)} mi`;
}

type Status = 'melhor' | 'pior' | 'neutro';

interface Indicator {
  label: string;
  key: keyof BancoRaioX;
  format: (v: number | undefined) => string;
  higherIsBetter: boolean;
  group: string;
  tooltip?: string;
  badge?: (v: number | undefined) => string;
  badgeColor?: (v: number | undefined) => string;
}

const INDICATORS: Indicator[] = [
  // Saúde Geral
  { group: 'Saúde Geral', label: 'Score de Saúde', key: 'score', format: (v) => v ? `${v}/100` : 'N/D', higherIsBetter: true,
    badgeColor: (v) => (v ?? 0) >= 80 ? 'text-green-600' : (v ?? 0) >= 60 ? 'text-yellow-600' : 'text-red-600',
  },
  { group: 'Saúde Geral', label: 'Ativo Total', key: 'ativo_total', format: fmtMoeda, higherIsBetter: true },
  { group: 'Saúde Geral', label: 'Lucro Líquido', key: 'lucro_liquido', format: fmtMoeda, higherIsBetter: true },
  // Prudenciais
  { group: 'Indicadores Prudenciais (BCB)', label: 'Índice de Basileia', key: 'basileia', format: (v) => fmt(v), higherIsBetter: true,
    tooltip: 'PR / RWA — mínimo regulatório 10,5%',
    badgeColor: (v) => (v ?? 0) >= 15 ? 'text-green-600' : (v ?? 0) >= 10.5 ? 'text-yellow-600' : 'text-red-600',
    badge: (v) => (v ?? 0) >= 15 ? 'Excelente' : (v ?? 0) >= 10.5 ? 'Adequado' : 'Crítico',
  },
  { group: 'Indicadores Prudenciais (BCB)', label: 'Capital Nível I', key: 'capital_nivel1', format: (v) => fmt(v), higherIsBetter: true,
    tooltip: 'CET1 + AT1 / RWA — mínimo 8%',
  },
  { group: 'Indicadores Prudenciais (BCB)', label: 'Taxa de Imobilização', key: 'imobilizacao', format: (v) => fmt(v), higherIsBetter: false,
    tooltip: 'Ativo Permanente / PR — máximo 50%',
    badgeColor: (v) => (v ?? 0) <= 10 ? 'text-green-600' : (v ?? 0) <= 25 ? 'text-yellow-600' : 'text-red-600',
    badge: (v) => (v ?? 0) <= 10 ? 'Excelente' : (v ?? 0) <= 25 ? 'Moderado' : 'Alto',
  },
  { group: 'Indicadores Prudenciais (BCB)', label: 'Razão de Alavancagem', key: 'razao_alavancagem', format: (v) => fmt(v), higherIsBetter: true,
    tooltip: 'Capital Nível I / Exposição Total',
  },
  // FGC
  { group: 'Nova Regulamentação FGC (Res. BCB 572/2026)', label: 'Funding / Capital', key: 'funding_capital', format: (v) => fmt(v, 'x'), higherIsBetter: false,
    tooltip: 'Captações / PR — quanto menor, mais conservador',
    badgeColor: (v) => (v ?? 0) <= 10 ? 'text-green-600' : (v ?? 0) <= 15 ? 'text-yellow-600' : 'text-red-600',
    badge: (v) => (v ?? 0) <= 10 ? 'Conservador' : (v ?? 0) <= 15 ? 'Moderado' : 'Alto',
  },
  { group: 'Nova Regulamentação FGC (Res. BCB 572/2026)', label: 'Cobertura Prudencial (AR/VR)', key: 'cobertura_prudencial', format: (v) => fmt(v), higherIsBetter: true,
    tooltip: 'AR estimado / VR estimado — ≥100% é favorável',
    badgeColor: (v) => (v ?? 0) >= 100 ? 'text-green-600' : (v ?? 0) >= 70 ? 'text-yellow-600' : 'text-red-600',
    badge: (v) => (v ?? 0) >= 100 ? 'Favorável' : (v ?? 0) >= 70 ? 'Atenção' : 'Risco',
  },
  { group: 'Nova Regulamentação FGC (Res. BCB 572/2026)', label: 'AR Estimado', key: 'ar_estimado', format: fmtMoeda, higherIsBetter: true,
    tooltip: 'Ativo de Referência = TVM + Carteira de Crédito',
  },
  { group: 'Nova Regulamentação FGC (Res. BCB 572/2026)', label: 'VR Estimado (Captações)', key: 'vr_estimado', format: fmtMoeda, higherIsBetter: false,
    tooltip: 'Valor de Referência estimado = Captações Totais',
  },
  // Balanço
  { group: 'Balanço', label: 'Patrimônio de Referência', key: 'pr', format: fmtMoeda, higherIsBetter: true },
  { group: 'Balanço', label: 'RWA Total', key: 'rwa', format: fmtMoeda, higherIsBetter: false },
  { group: 'Balanço', label: 'Carteira de Crédito', key: 'carteira_credito', format: fmtMoeda, higherIsBetter: true },
  { group: 'Balanço', label: 'Captações Totais', key: 'captacoes_total', format: fmtMoeda, higherIsBetter: false },
];

const GROUPS = [...new Set(INDICATORS.map(i => i.group))];

interface BankSelectorProps {
  bancos: BancoRaioX[];
  selected: BancoRaioX | null;
  onSelect: (b: BancoRaioX | null) => void;
  placeholder: string;
}

function BankSelector({ bancos, selected, onSelect, placeholder }: BankSelectorProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() =>
    bancos.filter(b => b.nome.toLowerCase().includes(search.toLowerCase())).slice(0, 20),
    [bancos, search]
  );

  if (selected) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{selected.nome}</p>
          <p className="text-xs text-muted-foreground">{selected.tipo} · Score {selected.score}/100</p>
        </div>
        <button onClick={() => onSelect(null)} className="rounded-full p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 rounded-xl border border-dashed border-border bg-secondary/30 p-4 hover:border-primary/40 hover:bg-primary/5 transition text-left"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <Plus className="h-5 w-5 text-muted-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">{placeholder}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-border bg-background shadow-lg">
          <div className="p-2">
            <input
              autoFocus
              type="text"
              placeholder="Buscar banco..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map(b => (
              <button
                key={b.nome}
                onClick={() => { onSelect(b); setOpen(false); setSearch(''); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/50 transition text-left"
              >
                <div className={`h-2 w-2 rounded-full ${b.situacao === 'verde' ? 'bg-green-500' : b.situacao === 'amarelo' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className="flex-1 text-sm font-medium text-foreground">{b.nome}</span>
                <span className="text-xs text-muted-foreground">{b.score}/100</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ComparadorClient({ bancos }: { bancos: BancoRaioX[] }) {
  const [selecionados, setSelecionados] = useState<(BancoRaioX | null)[]>([null, null, null]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(GROUPS.map(g => [g, true]))
  );

  const ativos = selecionados.filter(Boolean) as BancoRaioX[];

  function setSlot(idx: number, banco: BancoRaioX | null) {
    setSelecionados(prev => prev.map((s, i) => i === idx ? banco : s));
  }

  function getStatus(ind: Indicator, values: (number | undefined)[]): Status[] {
    const valid = values.filter(v => v != null && v > 0) as number[];
    if (valid.length < 2) return values.map(() => 'neutro');
    const best = ind.higherIsBetter ? Math.max(...valid) : Math.min(...valid);
    const worst = ind.higherIsBetter ? Math.min(...valid) : Math.max(...valid);
    return values.map(v => {
      if (v == null || v === 0) return 'neutro';
      if (v === best && best !== worst) return 'melhor';
      if (v === worst && best !== worst) return 'pior';
      return 'neutro';
    });
  }

  const statusColors: Record<Status, string> = {
    melhor: 'bg-green-50 dark:bg-green-950/20 ring-1 ring-green-200 dark:ring-green-800',
    pior: 'bg-red-50 dark:bg-red-950/20 ring-1 ring-red-200 dark:ring-red-800',
    neutro: '',
  };
  const statusIcons: Record<Status, React.ReactNode> = {
    melhor: <TrendingUp className="h-3 w-3 text-green-500" />,
    pior: <TrendingDown className="h-3 w-3 text-red-400" />,
    neutro: <Minus className="h-3 w-3 text-muted-foreground/30" />,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/bancos" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> Voltar ao ranking
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Comparador de Bancos</h1>
        <p className="mt-1 text-muted-foreground">Selecione até 3 bancos para comparar seus indicadores lado a lado.</p>
      </div>

      {/* Seletores */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map(i => (
          <BankSelector
            key={i}
            bancos={bancos.filter(b => !selecionados.some((s, si) => si !== i && s?.nome === b.nome))}
            selected={selecionados[i]}
            onSelect={(b) => setSlot(i, b)}
            placeholder={`Banco ${i + 1}`}
          />
        ))}
      </div>

      {ativos.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-secondary/20 py-20 text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">Selecione pelo menos um banco para começar</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Você pode comparar até 3 bancos simultaneamente</p>
        </div>
      )}

      {ativos.length > 0 && (
        <div className="space-y-4">
          {GROUPS.map(group => (
            <div key={group} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Group header */}
              <button
                onClick={() => setOpenGroups(p => ({ ...p, [group]: !p[group] }))}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{group}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openGroups[group] ? 'rotate-180' : ''}`} />
              </button>

              {openGroups[group] && (
                <div className="border-t border-border">
                  {/* Cabeçalho dos bancos */}
                  <div className={`grid gap-px bg-border`} style={{ gridTemplateColumns: `1fr repeat(${ativos.length}, 1fr)` }}>
                    <div className="bg-secondary/30 px-4 py-3 text-xs font-medium text-muted-foreground">Indicador</div>
                    {ativos.map(b => (
                      <div key={b.nome} className="bg-secondary/30 px-4 py-3">
                        <p className="text-xs font-semibold text-foreground truncate">{b.nome}</p>
                        <p className="text-[10px] text-muted-foreground">{b.tipo}</p>
                      </div>
                    ))}
                  </div>

                  {/* Linhas de indicadores */}
                  {INDICATORS.filter(ind => ind.group === group).map((ind, idx) => {
                    const values = ativos.map(b => b[ind.key] as number | undefined);
                    const statuses = getStatus(ind, values);
                    return (
                      <div
                        key={ind.key}
                        className={`grid gap-px bg-border ${idx % 2 === 0 ? '' : 'bg-secondary/10'}`}
                        style={{ gridTemplateColumns: `1fr repeat(${ativos.length}, 1fr)` }}
                      >
                        {/* Label */}
                        <div className="bg-background px-4 py-3">
                          <p className="text-sm text-foreground">{ind.label}</p>
                          {ind.tooltip && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{ind.tooltip}</p>}
                        </div>

                        {/* Valores */}
                        {values.map((v, vi) => (
                          <div key={vi} className={`bg-background px-4 py-3 ${statusColors[statuses[vi]]}`}>
                            <div className="flex items-center gap-1.5">
                              {statusIcons[statuses[vi]]}
                              <span className={`text-sm font-semibold ${ind.badgeColor?.(v) ?? 'text-foreground'}`}>
                                {ind.format(v)}
                              </span>
                            </div>
                            {ind.badge && v && v > 0 && (
                              <p className={`text-[10px] mt-0.5 ${ind.badgeColor?.(v) ?? 'text-muted-foreground'}`}>
                                {ind.badge(v)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Ratings */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">Ratings Internacionais</span>
            </div>
            <div className={`grid gap-px bg-border`} style={{ gridTemplateColumns: `1fr repeat(${ativos.length}, 1fr)` }}>
              <div className="bg-secondary/30 px-4 py-3 text-xs font-medium text-muted-foreground">Agência</div>
              {ativos.map(b => (
                <div key={b.nome} className="bg-secondary/30 px-4 py-3">
                  <p className="text-xs font-semibold text-foreground truncate">{b.nome}</p>
                </div>
              ))}
            </div>
            {[
              { label: "Moody's", key: 'rating_moodys' as const },
              { label: 'Fitch', key: 'rating_fitch' as const },
              { label: 'S&P', key: 'rating_sp' as const },
              { label: 'Perspectiva', key: 'rating_perspectiva' as const },
            ].map((r, idx) => (
              <div key={r.key} className={`grid gap-px bg-border`} style={{ gridTemplateColumns: `1fr repeat(${ativos.length}, 1fr)` }}>
                <div className={`bg-background px-4 py-3 text-sm text-foreground ${idx % 2 === 1 ? 'bg-secondary/10' : ''}`}>{r.label}</div>
                {ativos.map(b => (
                  <div key={b.nome} className={`bg-background px-4 py-3 ${idx % 2 === 1 ? 'bg-secondary/10' : ''}`}>
                    <span className="text-sm font-semibold text-foreground">{b[r.key] || 'N/D'}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Links para páginas individuais */}
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${ativos.length}, 1fr)` }}>
            {ativos.map(b => (
              <Link
                key={b.nome}
                href={`/banco/${slugify(b.nome)}`}
                className="rounded-xl border border-border bg-card p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition"
              >
                <p className="font-semibold text-foreground text-sm">{b.nome}</p>
                <p className="text-xs text-primary mt-1">Ver página completa →</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
