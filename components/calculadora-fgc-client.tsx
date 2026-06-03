'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Shield, AlertTriangle, CheckCircle2, Info, ExternalLink } from 'lucide-react';
import { type BancoRaioX } from '@/lib/bcb-api';

const LIMITE_FGC = 250000;
const LIMITE_GLOBAL = 1000000;

function slugify(nome: string) {
  return nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

interface Posicao {
  id: number;
  banco: string;
  valor: number;
}

export function CalculadoraFGCClient({ bancos }: { bancos: BancoRaioX[] }) {
  const [posicoes, setPosicoes] = useState<Posicao[]>([{ id: 1, banco: '', valor: 0 }]);
  const [buscas, setBuscas] = useState<Record<number, string>>({ 1: '' });
  const [abertos, setAbertos] = useState<Record<number, boolean>>({});

  const addPosicao = () => {
    const id = Date.now();
    setPosicoes(p => [...p, { id, banco: '', valor: 0 }]);
    setBuscas(b => ({ ...b, [id]: '' }));
  };

  const removePosicao = (id: number) => setPosicoes(p => p.filter(x => x.id !== id));

  const updateBanco = (id: number, banco: string) => setPosicoes(p => p.map(x => x.id === id ? { ...x, banco } : x));
  const updateValor = (id: number, valor: number) => setPosicoes(p => p.map(x => x.id === id ? { ...x, valor } : x));

  // Agrupa por banco (conglomerado) e calcula coberturas
  const totalInvestido = posicoes.reduce((s, p) => s + (p.valor || 0), 0);
  const porBanco = posicoes.reduce<Record<string, number>>((acc, p) => {
    if (p.banco && p.valor > 0) acc[p.banco] = (acc[p.banco] || 0) + p.valor;
    return acc;
  }, {});

  const resultados = Object.entries(porBanco).map(([banco, total]) => ({
    banco,
    total,
    coberto: Math.min(total, LIMITE_FGC),
    descoberto: Math.max(0, total - LIMITE_FGC),
    risco: total > LIMITE_FGC,
  }));

  const totalCoberto = Math.min(resultados.reduce((s, r) => s + r.coberto, 0), LIMITE_GLOBAL);
  const totalDescoberto = totalInvestido - totalCoberto;
  const acimaMilhao = totalCoberto >= LIMITE_GLOBAL;

  const getBancoInfo = (nome: string) => bancos.find(b => b.nome === nome);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Calculadora FGC</h1>
        <p className="mt-2 text-muted-foreground">Descubra quanto do seu dinheiro está protegido pelo Fundo Garantidor de Créditos.</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium">
          Limite: R$250 mil por CPF por banco · R$1 milhão global
        </div>
      </div>

      {/* Posições */}
      <div className="space-y-3 mb-4">
        {posicoes.map((pos, idx) => {
          const filtrados = buscas[pos.id]?.length >= 2
            ? bancos.filter(b => b.nome.toLowerCase().includes(buscas[pos.id].toLowerCase())).slice(0, 6)
            : [];

          return (
            <div key={pos.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{idx + 1}</span>
                <span className="text-sm font-medium text-foreground">Investimento</span>
                {posicoes.length > 1 && (
                  <button onClick={() => removePosicao(pos.id)} className="ml-auto text-muted-foreground hover:text-destructive transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Banco */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nome do banco..."
                    value={pos.banco || buscas[pos.id] || ''}
                    onChange={e => {
                      setBuscas(b => ({ ...b, [pos.id]: e.target.value }));
                      if (!e.target.value) updateBanco(pos.id, '');
                      setAbertos(a => ({ ...a, [pos.id]: true }));
                    }}
                    className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  {filtrados.length > 0 && abertos[pos.id] && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-border bg-background shadow-md">
                      {filtrados.map(b => (
                        <button key={b.nome} onClick={() => {
                          updateBanco(pos.id, b.nome);
                          setBuscas(bs => ({ ...bs, [pos.id]: b.nome }));
                          setAbertos(a => ({ ...a, [pos.id]: false }));
                        }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary/50 text-left text-sm">
                          <div className={`h-2 w-2 rounded-full ${b.situacao === 'verde' ? 'bg-green-500' : b.situacao === 'amarelo' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                          {b.nome}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Valor */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                  <input
                    type="number"
                    placeholder="0,00"
                    value={pos.valor || ''}
                    onChange={e => updateValor(pos.id, parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-border bg-secondary/30 pl-8 pr-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={addPosicao}
        className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition">
        <Plus className="h-4 w-4" /> Adicionar outro banco
      </button>

      {/* Resultado */}
      {totalInvestido > 0 && (
        <div className="space-y-4">
          {/* Resumo geral */}
          <div className={`rounded-2xl border p-6 ${totalDescoberto > 0 || acimaMilhao ? 'border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20' : 'border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-950/20'}`}>
            <div className="flex items-center gap-3 mb-4">
              {totalDescoberto > 0 || acimaMilhao
                ? <AlertTriangle className="h-8 w-8 text-red-500 shrink-0" />
                : <CheckCircle2 className="h-8 w-8 text-green-500 shrink-0" />}
              <div>
                <p className="font-bold text-foreground text-lg">
                  {totalDescoberto > 0 || acimaMilhao ? 'Parte do seu dinheiro não está coberta' : 'Todo o seu dinheiro está protegido pelo FGC'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {totalDescoberto > 0 || acimaMilhao
                    ? `${fmt(totalDescoberto)} estão fora da cobertura`
                    : `${fmt(totalCoberto)} garantidos pelo FGC`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-background/70 p-3 text-center">
                <p className="text-xs text-muted-foreground">Total investido</p>
                <p className="text-sm font-bold text-foreground mt-1">{fmt(totalInvestido)}</p>
              </div>
              <div className="rounded-xl bg-background/70 p-3 text-center">
                <p className="text-xs text-muted-foreground">Coberto FGC</p>
                <p className="text-sm font-bold text-green-600 mt-1">{fmt(totalCoberto)}</p>
              </div>
              <div className="rounded-xl bg-background/70 p-3 text-center">
                <p className="text-xs text-muted-foreground">Descoberto</p>
                <p className={`text-sm font-bold mt-1 ${totalDescoberto > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>{fmt(totalDescoberto)}</p>
              </div>
            </div>
          </div>

          {/* Detalhe por banco */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-secondary/30">
              <p className="text-sm font-semibold text-foreground">Detalhe por banco</p>
            </div>
            {resultados.map(r => {
              const info = getBancoInfo(r.banco);
              return (
                <div key={r.banco} className="px-4 py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground text-sm">{r.banco}</p>
                        {info && (
                          <Link href={`/banco/${slugify(r.banco)}`} className="text-primary">
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Investido: {fmt(r.total)} · Coberto: {fmt(r.coberto)}
                        {r.descoberto > 0 && <span className="text-red-500"> · Fora: {fmt(r.descoberto)}</span>}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${r.risco ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {r.risco ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                      {r.risco ? 'Excede limite' : 'Coberto'}
                    </div>
                  </div>
                  {r.risco && (
                    <div className="mt-2 rounded-lg bg-red-50 dark:bg-red-950/20 px-3 py-2 text-xs text-red-700 dark:text-red-400">
                      💡 Considere distribuir {fmt(r.descoberto)} em outro banco para maximizar a cobertura do FGC.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {acimaMilhao && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-950/20 p-4 flex gap-3">
              <Info className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Limite global atingido:</strong> O FGC garante no máximo R$1 milhão por CPF em um período de 4 anos, independentemente do número de bancos. Você atingiu esse limite.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info FGC */}
      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 font-semibold text-foreground flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" /> O que é o FGC?
        </h2>
        <p className="text-sm text-muted-foreground mb-3">
          O <strong className="text-foreground">Fundo Garantidor de Créditos (FGC)</strong> é uma entidade privada sem fins lucrativos que protege depositantes e investidores em caso de falência ou intervenção em instituições financeiras associadas.
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc ml-4">
          <li>Cobre: CDB, LCI, LCA, poupança, depósito à vista, LF, LC</li>
          <li><strong className="text-foreground">Não cobre:</strong> fundos de investimento, debêntures, CRI, CRA, ações</li>
          <li>Limite: R$250 mil por CPF por conglomerado financeiro</li>
          <li>Limite global: R$1 milhão por CPF a cada 4 anos</li>
        </ul>
        <a href="https://www.fgc.org.br/" target="_blank" rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          Site oficial do FGC <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        Esta calculadora é uma ferramenta educativa e não constitui aconselhamento financeiro.
      </p>
    </main>
  );
}
