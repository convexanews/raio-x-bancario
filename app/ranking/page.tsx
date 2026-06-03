import Link from 'next/link';
import { Shield, TrendingUp, Award, Info, ChevronRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getBancos, formatCurrency } from '@/lib/bcb-api';

export const metadata = {
  title: 'Ranking dos Bancos Mais Seguros do Brasil 2025 | Radar Bancário',
  description: 'Top 20 bancos brasileiros mais seguros por score de saúde financeira. Critérios baseados em Índice de Basileia e Taxa de Imobilização — dados oficiais do Banco Central (dez/2025).',
};

function slugify(nome: string) {
  return nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const MEDALHAS = ['🥇', '🥈', '🥉'];

export default function RankingPage() {
  const todos = getBancos().filter(b => b.score > 0);
  const top20 = todos.slice(0, 20);
  const mediaBasileia = (todos.reduce((s, b) => s + b.basileia, 0) / todos.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <Shield className="h-3.5 w-3.5" /> Atualizado dez/2025 — IF.data BCB
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Ranking dos Bancos Mais Seguros do Brasil
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Os 20 bancos brasileiros com melhor saúde financeira segundo dados oficiais do Banco Central.
            Score calculado com base no Índice de Basileia e Taxa de Imobilização.
          </p>
        </div>

        {/* Critérios */}
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Info className="h-4 w-4 text-primary" /> Como o ranking é calculado
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <span className="font-bold text-foreground shrink-0">Índice de Basileia (50 pts):</span>
              <span>≥15% = 50 pts · ≥10,5% = 30 pts · &lt;10,5% = 10 pts</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-foreground shrink-0">Imobilização (50 pts):</span>
              <span>≤10% = 50 pts · ≤25% = 30 pts · ≤50% = 15 pts</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground/60">
            Média de Basileia do setor: {mediaBasileia}% · Fonte: IF.data BCB (Conglomerado Prudencial, dez/2025) · {todos.length} instituições analisadas
          </p>
        </div>

        {/* Top 3 destaque */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {top20.slice(0, 3).map((banco, i) => (
            <Link key={banco.nome} href={`/banco/${slugify(banco.nome)}`}
              className="rounded-xl border border-primary/30 bg-primary/5 p-5 text-center hover:bg-primary/10 transition">
              <div className="text-3xl mb-2">{MEDALHAS[i]}</div>
              <p className="font-bold text-foreground">{banco.nome}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{banco.tipo}</p>
              <div className="mt-3 flex justify-center gap-4 text-xs">
                <span><span className="font-semibold text-primary">{banco.basileia}%</span> Basileia</span>
                <span><span className="font-semibold text-primary">{banco.score}/100</span> Score</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Tabela completa */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Banco</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Score</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Basileia</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Imobilização</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Classificação</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {top20.map((banco, i) => (
                  <tr key={banco.nome} className={`border-b border-border/50 hover:bg-secondary/20 transition ${i < 3 ? 'bg-primary/3' : ''}`}>
                    <td className="px-4 py-3 text-sm font-bold text-muted-foreground">
                      {i < 3 ? MEDALHAS[i] : `${i + 1}º`}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground">{banco.nome}</p>
                      <p className="text-xs text-muted-foreground">{banco.tipo}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold
                        ${banco.score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          banco.score >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {banco.score}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-foreground">{banco.basileia}%</td>
                    <td className="px-4 py-3 text-center text-foreground">{banco.imobilizacao}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold
                        ${banco.situacao === 'verde' ? 'text-green-600 dark:text-green-400' :
                          banco.situacao === 'amarelo' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'}`}>
                        {banco.situacao === 'verde' ? 'Saudável' : banco.situacao === 'amarelo' ? 'Atenção' : 'Crítico'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/banco/${slugify(banco.nome)}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        Ver <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Links para outros rankings */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/ranking/basileia"
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:bg-primary/5 transition">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Ranking de Basileia</p>
                <p className="text-xs text-muted-foreground">Quais bancos têm maior capitalização?</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </div>
          </Link>
          <Link href="/bancos"
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:bg-primary/5 transition">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Ranking Completo</p>
                <p className="text-xs text-muted-foreground">Todos os {todos.length} bancos analisados</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </div>
          </Link>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Metodologia:</strong> Dados extraídos do sistema IF.data do Banco Central do Brasil (Conglomerado Prudencial, data-base dez/2025).
            O score é uma métrica simplificada baseada em dois indicadores regulatórios e não substitui análise profissional completa.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
