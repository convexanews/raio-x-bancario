import Link from 'next/link';
import { Shield, ChevronRight, TrendingUp } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getBancos } from '@/lib/bcb-api';

export const metadata = {
  title: 'Ranking de Basileia dos Bancos Brasileiros 2025 | Radar Bancário',
  description: 'Quais bancos têm maior Índice de Basileia no Brasil? Ranking completo por capitalização regulatória, com dados oficiais do Banco Central (mar/2026). Mínimo exigido: 10,5%.',
};

function slugify(nome: string) {
  return nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function RankingBasileiaPage() {
  const todos = getBancos().filter(b => b.score > 0 && b.basileia > 0);
  const ranking = [...todos].sort((a, b) => b.basileia - a.basileia);
  const media = (todos.reduce((s, b) => s + b.basileia, 0) / todos.length).toFixed(1);
  const acimaMedio = todos.filter(b => b.basileia >= parseFloat(media)).length;
  const abaixoMinimo = todos.filter(b => b.basileia < 10.5).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <TrendingUp className="h-3.5 w-3.5" /> Dados BCB mar/2026
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Ranking de Basileia dos Bancos Brasileiros
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            O Índice de Basileia mede quanto capital próprio o banco possui para absorver perdas.
            Quanto maior, mais seguro e capitalizado o banco.
          </p>
        </div>

        {/* Resumo */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{media}%</p>
            <p className="text-xs text-muted-foreground mt-1">Média do setor</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{acimaMedio}</p>
            <p className="text-xs text-muted-foreground mt-1">Acima da média</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{abaixoMinimo}</p>
            <p className="text-xs text-muted-foreground mt-1">Abaixo do mínimo (10,5%)</p>
          </div>
        </div>

        {/* Explicação */}
        <div className="mb-6 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          <p><strong className="text-foreground">O que é o Índice de Basileia?</strong> É calculado dividindo o Patrimônio de Referência (PR) pelos Ativos Ponderados pelo Risco (RWA). O Banco Central exige mínimo de <strong className="text-foreground">10,5%</strong>. Bancos saudáveis operam acima de <strong className="text-foreground">13%</strong>, e os mais capitalizados acima de <strong className="text-foreground">15%</strong>.</p>
        </div>

        {/* Tabela ranking */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground w-12">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Banco</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Basileia</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground hidden sm:table-cell">vs Média</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((banco, i) => {
                  const diff = banco.basileia - parseFloat(media);
                  return (
                    <tr key={banco.nome} className="border-b border-border/50 hover:bg-secondary/20 transition">
                      <td className="px-4 py-3 text-sm font-bold text-muted-foreground">{i + 1}º</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{banco.nome}</p>
                        <p className="text-xs text-muted-foreground">{banco.tipo}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="hidden sm:block h-1.5 rounded-full bg-secondary overflow-hidden w-16">
                            <div
                              className={`h-full rounded-full ${banco.basileia >= 15 ? 'bg-green-500' : banco.basileia >= 10.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min((banco.basileia / 30) * 100, 100)}%` }}
                            />
                          </div>
                          <span className={`font-bold ${banco.basileia >= 15 ? 'text-green-600 dark:text-green-400' : banco.basileia >= 10.5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600'}`}>
                            {banco.basileia}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className={`text-xs font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {diff >= 0 ? '+' : ''}{diff.toFixed(1)} p.p.
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-semibold ${banco.basileia >= 15 ? 'text-green-600 dark:text-green-400' : banco.basileia >= 10.5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600'}`}>
                          {banco.basileia >= 15 ? 'Excelente' : banco.basileia >= 10.5 ? 'Adequado' : 'Crítico'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/banco/${slugify(banco.nome)}`}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          Ver <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Link href="/ranking" className="text-sm text-primary hover:underline flex items-center gap-1">
            <Shield className="h-3.5 w-3.5" /> Ranking mais seguros
          </Link>
          <Link href="/bancos" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver todos os bancos
          </Link>
        </div>

        <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-4">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Fonte:</strong> IF.data — Banco Central do Brasil. Conglomerado Prudencial, data-base mar/2026.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
