'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend, PieChart, Pie } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ResumoIndicadores } from '@/lib/bcb-api';
import { TrendingUp, PieChartIcon, BarChart3 } from 'lucide-react';

interface DashboardChartsProps {
  bancos: ResumoIndicadores[];
}

export function DashboardCharts({ bancos }: DashboardChartsProps) {
  // Dados para gráfico de barras - Top 5 por ROE
  const topRoeData = [...bancos]
    .filter(b => b.roe !== null)
    .sort((a, b) => (b.roe ?? 0) - (a.roe ?? 0))
    .slice(0, 5)
    .map(b => ({
      name: b.instituicao.split(' ')[0],
      roe: b.roe,
      fill: b.roe! >= 20 ? 'var(--color-accent)' : b.roe! >= 15 ? 'var(--color-primary)' : 'var(--color-chart-3)',
    }));

  // Dados para pizza - Distribuição por segmento
  const segmentoData = bancos.reduce((acc, b) => {
    const existing = acc.find(item => item.name === b.segmento);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: b.segmento, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];

  // Dados para área - Taxa de imobilização média por segmento
  const imobilizacaoData = segmentoData.map(seg => {
    const bancosSegmento = bancos.filter(b => b.segmento === seg.name && b.taxaImobilizacao !== null);
    const media = bancosSegmento.length > 0 
      ? bancosSegmento.reduce((sum, b) => sum + (b.taxaImobilizacao ?? 0), 0) / bancosSegmento.length
      : 0;
    return {
      segmento: seg.name,
      taxaMedia: Number(media.toFixed(1)),
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
          {/* Top 5 ROE */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Top 5 Bancos por ROE</CardTitle>
              </div>
              <CardDescription>Retorno sobre patrimônio líquido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topRoeData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis type="number" tickFormatter={(v) => `${v}%`} stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} width={70} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-card)', 
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-foreground)'
                      }}
                      formatter={(value) => [`${value}%`, 'ROE']}
                    />
                    <Bar dataKey="roe" radius={[0, 4, 4, 0]}>
                      {topRoeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribuição por Segmento */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Distribuição por Segmento</CardTitle>
              </div>
              <CardDescription>Quantidade de instituições</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={segmentoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {segmentoData.map((_, index) => (
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

          {/* Taxa de Imobilização Média */}
          <Card className="lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Taxa Imobilização Média</CardTitle>
              </div>
              <CardDescription>Por segmento de atuação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={imobilizacaoData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTaxa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="segmento" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis tickFormatter={(v) => `${v}%`} stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-card)', 
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        color: 'var(--color-foreground)'
                      }}
                      formatter={(value) => [`${value}%`, 'Taxa Média']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="taxaMedia" 
                      stroke="var(--color-primary)" 
                      fillOpacity={1} 
                      fill="url(#colorTaxa)" 
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
