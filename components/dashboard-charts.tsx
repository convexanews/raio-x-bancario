'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type BancoRaioX } from '@/lib/bcb-api';
import { TrendingUp, PieChartIcon, BarChart3 } from 'lucide-react';

interface DashboardChartsProps {
  bancos: BancoRaioX[];
}

export function DashboardCharts({ bancos }: DashboardChartsProps) {
  const topScoreData = [...bancos]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(b => ({
      name: b.nome.length > 12 ? b.nome.substring(0, 12) + '…' : b.nome,
      score: b.score,
      fill: b.score >= 90 ? 'var(--color-accent)' : b.score >= 70 ? 'var(--color-primary)' : 'var(--color-chart-3)',
    }));

  const tipoData = bancos.reduce((acc, b) => {
    const existing = acc.find(item => item.name === b.tipo);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: b.tipo, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];

  const basileiaPorTipo = tipoData.map(tipo => {
    const bancosTipo = bancos.filter(b => b.tipo === tipo.name);
    const media = bancosTipo.reduce((sum, b) => sum + b.basileia, 0) / bancosTipo.length;
    return {
      tipo: tipo.name.replace('Banco ', ''),
      mediaBasileia: Number(media.toFixed(1)),
    };
  });

  return (
    <section className="border-t border-border py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
            <TrendingUp className="h-7 w-7 text-primary" />
            Visão Geral do Mercado
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
            Análise comparativa dos principais indicadores do sistema financeiro nacional.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Top 8 por Score */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Top 8 Bancos por Score</CardTitle>
              </div>
              <CardDescription>Score de saúde financeira (0-100)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topScoreData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis type="number" domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-foreground)'
                      }}
                      formatter={(value) => [`${value}/100`, 'Score']}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {topScoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribuição por Tipo */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Distribuição por Tipo</CardTitle>
              </div>
              <CardDescription>Quantidade de instituições por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tipoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {tipoData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-foreground)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Basileia Média por Tipo */}
          <Card className="lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Basileia Média por Tipo</CardTitle>
              </div>
              <CardDescription>Índice de Basileia médio por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={basileiaPorTipo} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBasileia" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="tipo" stroke="var(--color-muted-foreground)" fontSize={11} />
                    <YAxis tickFormatter={(v) => `${v}%`} stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-foreground)'
                      }}
                      formatter={(value) => [`${value}%`, 'Basileia Média']}
                    />
                    <Area
                      type="monotone"
                      dataKey="mediaBasileia"
                      stroke="var(--color-primary)"
                      fillOpacity={1}
                      fill="url(#colorBasileia)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
