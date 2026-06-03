import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Shield, Database, Calculator, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Metodologia | Radar Bancário',
  description: 'Entenda como o Radar Bancário calcula o score de saúde financeira dos bancos, de onde vêm os dados e como interpretamos os indicadores do Banco Central.',
};

export default function MetodologiaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Metodologia</h1>
          <p className="mt-3 text-muted-foreground">Como calculamos os indicadores e o score de saúde financeira.</p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">

          {/* Fonte */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">1. Fonte dos dados</h2>
            </div>
            <p className="mb-3">Todos os dados são extraídos do sistema <strong className="text-foreground">IF.data</strong> do Banco Central do Brasil, acessado via API OData pública (sem autenticação, dados de domínio público conforme Lei nº 12.527/2011).</p>
            <div className="rounded-lg bg-secondary/50 p-3 font-mono text-xs">
              https://olinda.bcb.gov.br/olinda/servico/IFDATA/versao/v1/odata/
            </div>
            <ul className="mt-3 list-disc ml-4 space-y-1">
              <li><strong className="text-foreground">Tipo de consolidado:</strong> Conglomerado Prudencial (visão mais completa para análise de risco)</li>
              <li><strong className="text-foreground">Período:</strong> dezembro/2025 (data-base mais recente disponível)</li>
              <li><strong className="text-foreground">Relatórios utilizados:</strong> 1-Resumo, 3-Passivo, 5-Informações de Capital</li>
              <li><strong className="text-foreground">Frequência de atualização:</strong> Trimestral (60-90 dias de defasagem)</li>
            </ul>
            <a href="https://www3.bcb.gov.br/ifdata/" target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-primary hover:underline text-xs">
              Acessar IF.data oficial <ExternalLink className="h-3 w-3" />
            </a>
          </section>

          {/* Score */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">2. Cálculo do Score</h2>
            </div>
            <p className="mb-4">O score de saúde financeira (0-100) é uma <strong className="text-foreground">métrica simplificada criada pelo Radar Bancário</strong> para facilitar a comparação. <strong className="text-foreground">Não é uma métrica oficial do Banco Central.</strong></p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <p className="font-semibold text-foreground mb-2">Índice de Basileia (50 pts)</p>
                <table className="w-full text-xs">
                  <tbody>
                    <tr><td className="py-1 text-green-600">≥ 15%</td><td className="text-right font-bold">50 pts</td></tr>
                    <tr><td className="py-1 text-yellow-600">10,5% – 14,9%</td><td className="text-right font-bold">30 pts</td></tr>
                    <tr><td className="py-1 text-red-600">&lt; 10,5%</td><td className="text-right font-bold">10 pts</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="font-semibold text-foreground mb-2">Taxa de Imobilização (50 pts)</p>
                <table className="w-full text-xs">
                  <tbody>
                    <tr><td className="py-1 text-green-600">≤ 10%</td><td className="text-right font-bold">50 pts</td></tr>
                    <tr><td className="py-1 text-yellow-600">10,1% – 25%</td><td className="text-right font-bold">30 pts</td></tr>
                    <tr><td className="py-1 text-yellow-600">25,1% – 50%</td><td className="text-right font-bold">15 pts</td></tr>
                    <tr><td className="py-1 text-red-600">&gt; 50%</td><td className="text-right font-bold">5 pts</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-xs">
              <strong className="text-foreground">Classificação:</strong> Score ≥ 80 = Saudável · Score 60-79 = Atenção · Score &lt; 60 = Crítico
            </div>
          </section>

          {/* Indicadores BCB */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">3. Indicadores regulatórios</h2>
            </div>
            <div className="space-y-4">
              {[
                { nome: 'Índice de Basileia', formula: 'PR / RWA × 100', minimo: '10,5% (Basileia III)', fonte: 'Relatório 5 — IF.data' },
                { nome: 'Taxa de Imobilização', formula: 'Ativo Permanente / PR × 100', minimo: 'Máximo 50%', fonte: 'Relatório 5 — IF.data' },
                { nome: 'Capital Nível I (AT1)', formula: '(Capital Principal + Capital Complementar) / RWA × 100', minimo: 'Mínimo 8%', fonte: 'Relatório 5 — IF.data' },
                { nome: 'Funding / Capital', formula: 'Captações Totais / PR', minimo: 'Sem limite regulatório oficial', fonte: 'Relatório 1 e 5' },
              ].map(ind => (
                <div key={ind.nome} className="border-l-2 border-primary/30 pl-4">
                  <p className="font-semibold text-foreground">{ind.nome}</p>
                  <p className="text-xs mt-0.5"><span className="text-muted-foreground">Fórmula:</span> <code className="bg-secondary px-1 rounded">{ind.formula}</code></p>
                  <p className="text-xs mt-0.5"><span className="text-muted-foreground">Referência regulatória:</span> {ind.minimo}</p>
                  <p className="text-xs mt-0.5"><span className="text-muted-foreground">Origem:</span> {ind.fonte}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FGC */}
          <section className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Indicadores FGC (estimados)</h2>
            <p className="mb-3">Baseados nas <strong className="text-foreground">Res. CMN 5.295/2026</strong> e <strong className="text-foreground">Res. BCB 572/2026</strong>. O BCB ainda não publicou os dados oficiais de AR e VR — os valores são estimativas:</p>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2"><span className="font-semibold text-foreground min-w-[180px]">VR estimado:</span> Captações Totais (proxy para a exposição do FGC)</div>
              <div className="flex gap-2"><span className="font-semibold text-foreground min-w-[180px]">AR estimado:</span> TVM + Carteira de Crédito (proxy para qualidade dos ativos)</div>
              <div className="flex gap-2"><span className="font-semibold text-foreground min-w-[180px]">Cobertura Prudencial:</span> AR estimado / VR estimado × 100</div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground/70 italic">Quando o BCB publicar os dados oficiais de AR e VR, atualizaremos para os valores reais.</p>
          </section>

          {/* Limitações */}
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Limitações e avisos</h2>
            <ul className="list-disc ml-4 space-y-2">
              <li>Dados com defasagem de 60-90 dias em relação à situação atual.</li>
              <li>Cooperativas e bancos de desenvolvimento podem ter indicadores atípicos por natureza operacional — não indica necessariamente maior risco.</li>
              <li>O score não considera fatores qualitativos (governança, gestão, diversificação de receitas).</li>
              <li>Ratings de agências internacionais refletem opinião das agências, não do Radar Bancário.</li>
              <li><strong className="text-foreground">Não é recomendação de investimento.</strong> Consulte um profissional certificado.</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 flex gap-4 flex-wrap">
          <Link href="/faq" className="text-sm text-primary hover:underline">→ Perguntas frequentes</Link>
          <Link href="/calculadora-fgc" className="text-sm text-primary hover:underline">→ Calculadora FGC</Link>
          <a href="https://www3.bcb.gov.br/ifdata/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">→ IF.data BCB <ExternalLink className="h-3 w-3" /></a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
