'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Shield, CheckCircle2, AlertTriangle, XCircle, ChevronRight, Building2 } from 'lucide-react';
import { type BancoRaioX } from '@/lib/bcb-api';

function slugify(nome: string) {
  return nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function MeuBancoClient({ bancos }: { bancos: BancoRaioX[] }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<BancoRaioX | null>(null);

  const results = useMemo(() =>
    query.length >= 2
      ? bancos.filter(b => b.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
      : [],
    [bancos, query]
  );

  const statusInfo = (banco: BancoRaioX) => {
    if (banco.score >= 80) return {
      icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
      titulo: 'Seu banco está saudável',
      cor: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800',
      frase: `O ${banco.nome} apresenta bons indicadores financeiros segundo os dados mais recentes do Banco Central.`,
    };
    if (banco.score >= 60) return {
      icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
      titulo: 'Seu banco merece atenção',
      cor: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800',
      frase: `O ${banco.nome} apresenta alguns indicadores que merecem acompanhamento. Não é uma situação crítica, mas vale monitorar.`,
    };
    return {
      icon: <XCircle className="h-16 w-16 text-red-500" />,
      titulo: 'Seu banco tem indicadores críticos',
      cor: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800',
      frase: `O ${banco.nome} apresenta indicadores abaixo do esperado. Recomendamos verificar a análise completa.`,
    };
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Meu banco é seguro?</h1>
        <p className="mt-3 text-muted-foreground">
          Digite o nome do seu banco e veja em segundos o que os dados do Banco Central dizem sobre ele.
        </p>
      </div>

      {/* Busca */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Digite o nome do seu banco..."
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); }}
          className="w-full rounded-2xl border border-border bg-card px-5 py-4 pl-12 text-lg shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          autoFocus
        />

        {/* Sugestões */}
        {results.length > 0 && !selected && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-border bg-background shadow-lg">
            {results.map(b => (
              <button
                key={b.nome}
                onClick={() => { setSelected(b); setQuery(b.nome); }}
                className="flex w-full items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition text-left"
              >
                <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${b.situacao === 'verde' ? 'bg-green-500' : b.situacao === 'amarelo' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{b.nome}</p>
                  <p className="text-xs text-muted-foreground">{b.tipo}</p>
                </div>
                <span className={`text-xs font-bold ${b.score >= 80 ? 'text-green-600' : b.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {b.score}/100
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Resultado */}
      {selected && (() => {
        const info = statusInfo(selected);
        return (
          <div className={`rounded-2xl border p-8 ${info.bg}`}>
            <div className="flex flex-col items-center text-center gap-4 mb-6">
              {info.icon}
              <div>
                <h2 className={`text-2xl font-bold ${info.cor}`}>{info.titulo}</h2>
                <p className="mt-2 text-muted-foreground">{info.frase}</p>
              </div>
            </div>

            {/* Indicadores rápidos */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl bg-background/70 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Score</p>
                <p className={`text-xl font-bold ${info.cor}`}>{selected.score}/100</p>
              </div>
              <div className="rounded-xl bg-background/70 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Basileia</p>
                <p className="text-xl font-bold text-foreground">{selected.basileia}%</p>
              </div>
              <div className="rounded-xl bg-background/70 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Imobilização</p>
                <p className="text-xl font-bold text-foreground">{selected.imobilizacao}%</p>
              </div>
            </div>

            <Link
              href={`/banco/${slugify(selected.nome)}`}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition"
            >
              Ver análise completa <ChevronRight className="h-4 w-4" />
            </Link>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Dados: IF.data BCB dez/2025 · Não é recomendação de investimento
            </p>
          </div>
        );
      })()}

      {/* Bancos populares */}
      {!selected && query.length < 2 && (
        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">Bancos mais consultados:</p>
          <div className="flex flex-wrap gap-2">
            {['Itaú Unibanco','Bradesco','Banco do Brasil','Nubank','Santander Brasil','Caixa Econômica Federal','Inter','BTG Pactual'].map(nome => {
              const b = bancos.find(x => x.nome === nome);
              if (!b) return null;
              return (
                <button key={nome} onClick={() => { setQuery(b.nome); setSelected(b); }}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-primary/50 hover:bg-primary/5 transition">
                  <div className={`h-2 w-2 rounded-full ${b.situacao === 'verde' ? 'bg-green-500' : b.situacao === 'amarelo' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  {nome}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 rounded-lg border border-border bg-secondary/30 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Aviso:</strong> Esta análise é baseada em dados públicos do Banco Central (IF.data, dez/2025) e tem caráter exclusivamente informativo. Não constitui recomendação de investimento. O FGC garante até R$250 mil por CPF por instituição.
        </p>
      </div>
    </main>
  );
}
