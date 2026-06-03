import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, Percent, Star, Award, Building2, AlertTriangle, ExternalLink, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getBancos, type BancoRaioX } from '@/lib/bcb-api';

function slugify(nome: string) {
  return nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function generateStaticParams() {
  return getBancos().map(b => ({ slug: slugify(b.nome) }));
}

export default async function BancoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bancos = getBancos();
  const banco = bancos.find(b => slugify(b.nome) === slug);
  if (!banco) notFound();

  const isLiquidado = banco.fonte_dados?.includes('LIQUIDADO') || banco.score === 0;
  const media = {
    basileia: bancos.filter(b => b.score > 0).reduce((s, b) => s + b.basileia, 0) / bancos.filter(b => b.score > 0).length,
    imobilizacao: bancos.filter(b => b.score > 0).reduce((s, b) => s + b.imobilizacao, 0) / bancos.filter(b => b.score > 0).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link href="/#bancos" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar ao ranking
        </Link>

        {/* Header do banco */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${isLiquidado ? 'bg-destructive/20' : 'bg-primary/20'}`}>
              <Building2 className={`h-7 w-7 ${isLiquidado ? 'text-destructive' : 'text-primary'}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{banco.nome}</h1>
              <p className="text-sm text-muted-foreground">{banco.tipo} &bull; {banco.nome_bcb}</p>
            </div>
          </div>
          {isLiquidado ? (
            <div className="flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-bold text-white">
              <XCircle className="h-4 w-4" /> LIQUIDADO
            </div>
          ) : (
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${banco.score >= 90 ? 'bg-accent text-accent-foreground' : banco.score >= 70 ? 'bg-primary text-primary-foreground' : banco.score >= 50 ? 'bg-yellow-500 text-black' : 'bg-destructive text-white'}`}>
              <Star className="h-4 w-4" /> Score: {banco.score}/100
            </div>
          )}
        </div>

        {/* Alerta liquidado */}
        {isLiquidado && (
          <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">Instituicao em Liquidacao Extrajudicial</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  O Banco Central decretou a liquidacao extrajudicial desta instituicao. Os dados abaixo sao historicos e referem-se ao ultimo periodo antes da intervencao. Investidores com valores aplicados devem procurar o FGC (Fundo Garantidor de Creditos).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Score Breakdown */}
        {!isLiquidado && (
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Info className="h-5 w-5 text-primary" /> Como o score e calculado
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <ScoreItem
                label="Indice de Basileia"
                value={banco.basileia}
                unit="%"
                points={banco.basileia >= 15 ? 50 : banco.basileia >= 10.5 ? 30 : 10}
                maxPoints={50}
                description={banco.basileia >= 15 ? 'Acima de 15% — Excelente capitalizacao' : banco.basileia >= 10.5 ? 'Entre 10.5% e 15% — Adequado' : 'Abaixo do minimo regulatorio (10.5%)'}
                good={banco.basileia >= 15}
                warning={banco.basileia >= 10.5 && banco.basileia < 15}
                icon={<Shield className="h-4 w-4" />}
                media={media.basileia}
              />
              <ScoreItem
                label="Taxa de Imobilizacao"
                value={banco.imobilizacao}
                unit="%"
                points={banco.imobilizacao <= 10 ? 50 : banco.imobilizacao <= 25 ? 30 : banco.imobilizacao <= 50 ? 15 : 5}
                maxPoints={50}
                description={banco.imobilizacao <= 10 ? 'Ate 10% — Excelente liquidez patrimonial' : banco.imobilizacao <= 25 ? 'Entre 10% e 25% — Moderado' : 'Acima de 25% — Alta imobilizacao'}
                good={banco.imobilizacao <= 10}
                warning={banco.imobilizacao > 10 && banco.imobilizacao <= 25}
                icon={<Percent className="h-4 w-4" />}
                media={media.imobilizacao}
                inverted
              />
            </div>
            <div className="mt-4 rounded-lg bg-secondary/50 p-3">
              <p className="text-center text-sm text-muted-foreground">
                Score total: <span className="font-bold text-foreground">{banco.basileia >= 15 ? 50 : banco.basileia >= 10.5 ? 30 : 10}</span> (Basileia) + <span className="font-bold text-foreground">{banco.imobilizacao <= 10 ? 50 : banco.imobilizacao <= 25 ? 30 : banco.imobilizacao <= 50 ? 15 : 5}</span> (Imobilizacao) = <span className="text-lg font-bold text-primary">{banco.score}/100</span>
              </p>
            </div>
          </div>
        )}

        {/* Indicadores Prudenciais BCB */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="mb-1 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Indicadores Prudenciais</h2>
          </div>
          <p className="mb-6 text-xs text-muted-foreground">Metodologia conforme exigido pelo Banco Central do Brasil (Resolucao CMN 4.958/2021). Dados extraidos do sistema IF.data.</p>

          <div className="grid gap-5 sm:grid-cols-3">
            {/* 1. Basileia */}
            <div className="rounded-xl border border-border bg-secondary/30 p-5">
              <div className="mb-1 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Indice de Basileia</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{banco.basileia}%</div>
              <div className={`mt-1 text-xs font-semibold ${banco.basileia >= 15 ? 'text-accent' : banco.basileia >= 10.5 ? 'text-yellow-500' : 'text-destructive'}`}>
                {banco.basileia >= 15 ? 'Acima do recomendado' : banco.basileia >= 10.5 ? 'Dentro do minimo' : 'ABAIXO do minimo regulatorio'}
              </div>
              <div className="mt-3 space-y-1 border-t border-border pt-3">
                <p className="text-[11px] text-muted-foreground"><strong>Formula:</strong> Patrimonio de Referencia (PR) / Ativos Ponderados pelo Risco (RWA)</p>
                <p className="text-[11px] text-muted-foreground"><strong>O que mede:</strong> Quanto de capital proprio o banco tem para absorver perdas. Quanto maior, mais seguro.</p>
                <p className="text-[11px] text-muted-foreground"><strong>Referencia BCB:</strong> Minimo exigido 10,5% (Basileia III). Bancos saudaveis operam acima de 13%.</p>
              </div>
            </div>

            {/* 2. Funding/Capital */}
            <div className="rounded-xl border border-border bg-secondary/30 p-5">
              <div className="mb-1 flex items-center gap-2">
                <Percent className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Alavancagem de Captacao</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{banco.funding_capital > 0 ? `${banco.funding_capital}x` : 'N/D'}</div>
              {banco.funding_capital > 0 && (
                <div className={`mt-1 text-xs font-semibold ${banco.funding_capital <= 10 ? 'text-accent' : banco.funding_capital <= 15 ? 'text-yellow-500' : 'text-destructive'}`}>
                  {banco.funding_capital <= 10 ? 'Alavancagem conservadora' : banco.funding_capital <= 15 ? 'Alavancagem moderada' : 'Alta alavancagem'}
                </div>
              )}
              <div className="mt-3 space-y-1 border-t border-border pt-3">
                <p className="text-[11px] text-muted-foreground"><strong>Formula:</strong> Captacoes / Patrimonio de Referencia (PR)</p>
                <p className="text-[11px] text-muted-foreground"><strong>O que mede:</strong> Quantas vezes o banco capta dinheiro de terceiros em relacao ao seu capital. Ex: 8x = para cada R$1 de capital, captou R$8.</p>
                <p className="text-[11px] text-muted-foreground"><strong>Observacao:</strong> Valores altos indicam dependencia de captacoes. Bancos de desenvolvimento e publicos podem ter valores atipicos por receberem repasses governamentais.</p>
              </div>
            </div>

            {/* 3. Cobertura Prudencial */}
            <div className="rounded-xl border border-border bg-secondary/30 p-5">
              <div className="mb-1 flex items-center gap-2">
                <Percent className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Exposicao ao Risco</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{banco.cobertura_prudencial > 0 ? `${banco.cobertura_prudencial}%` : 'N/D'}</div>
              {banco.cobertura_prudencial > 0 && (
                <div className={`mt-1 text-xs font-semibold ${banco.cobertura_prudencial <= 70 ? 'text-accent' : banco.cobertura_prudencial <= 100 ? 'text-yellow-500' : 'text-destructive'}`}>
                  {banco.cobertura_prudencial <= 70 ? 'Exposicao controlada' : banco.cobertura_prudencial <= 100 ? 'Exposicao moderada' : 'Exposicao elevada'}
                </div>
              )}
              <div className="mt-3 space-y-1 border-t border-border pt-3">
                <p className="text-[11px] text-muted-foreground"><strong>Formula:</strong> Ativos Ponderados pelo Risco (RWA) / Captacoes</p>
                <p className="text-[11px] text-muted-foreground"><strong>O que mede:</strong> Quanto do dinheiro captado de clientes esta em operacoes de risco (credito, mercado, operacional).</p>
                <p className="text-[11px] text-muted-foreground"><strong>Observacao:</strong> Acima de 100% significa que o banco opera com risco alem das captacoes, usando capital proprio. Bancos de desenvolvimento e fomento podem ter valores altos por natureza (ex: BNDES, BNB).</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-secondary/50 p-3">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Nota metodologica:</strong> Os indicadores acima seguem as definicoes do Banco Central conforme Resolucao CMN 4.958/2021 e Circular 3.748/2015. Os dados sao extraidos diretamente do sistema IF.data (Conglomerado Prudencial). Bancos publicos, de desenvolvimento e cooperativas podem apresentar valores atipicos devido a sua natureza operacional diferenciada.
            </p>
          </div>
        </div>

        {/* Taxa de Imobilizacao */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-1 flex items-center gap-2"><Percent className="h-4 w-4 text-primary" /><span className="text-sm font-medium text-foreground">Taxa de Imobilizacao</span></div>
            <div className="text-3xl font-bold text-foreground">{banco.imobilizacao}%</div>
            <p className="mt-1 text-xs text-muted-foreground">Maximo tolerado pelo BCB: 50%. Quanto menor, mais liquidez o banco tem para honrar compromissos.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-1 flex items-center gap-2"><Star className="h-4 w-4 text-primary" /><span className="text-sm font-medium text-foreground">Classificacao Geral</span></div>
            <div className={`text-3xl font-bold ${banco.situacao === 'verde' ? 'text-accent' : banco.situacao === 'amarelo' ? 'text-yellow-500' : 'text-destructive'}`}>
              {banco.situacao === 'verde' ? 'Saudavel' : banco.situacao === 'amarelo' ? 'Atencao' : 'Critico'}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Score: {banco.score}/100 — Baseado em Basileia + Imobilizacao</p>
          </div>
        </div>

        {/* Ratings */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Award className="h-5 w-5 text-primary" /> Ratings Internacionais
          </h2>
          {(banco.rating_moodys || banco.rating_fitch || banco.rating_sp) ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <RatingCard agency="Moody's" rating={banco.rating_moodys} description={getMoodysDescription(banco.rating_moodys)} />
              <RatingCard agency="Fitch" rating={banco.rating_fitch} description={getFitchDescription(banco.rating_fitch)} />
              <RatingCard agency="S&P" rating={banco.rating_sp} description={getSPDescription(banco.rating_sp)} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Esta instituicao nao possui ratings publicados pelas agencias internacionais (Moodys, Fitch, S&P).</p>
          )}
          {banco.rating_perspectiva && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm">
              <span className="text-muted-foreground">Perspectiva:</span>
              <span className={`font-semibold ${banco.rating_perspectiva === 'Positiva' ? 'text-accent' : banco.rating_perspectiva === 'Negativa' ? 'text-destructive' : 'text-foreground'}`}>
                {banco.rating_perspectiva}
              </span>
            </div>
          )}
          {banco.rating_fonte && (
            <p className="mt-2 text-xs text-muted-foreground">Fonte: {banco.rating_fonte}</p>
          )}
        </div>

        {/* Fonte dos dados */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Fonte dos Dados</h2>
          <p className="text-sm text-muted-foreground">{banco.fonte_dados}</p>
          <a href="https://www3.bcb.gov.br/ifdata/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary transition hover:underline">
            Verificar no IF.data do Banco Central <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg border border-border bg-secondary/50 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Aviso:</strong> As informacoes sao baseadas em dados publicos do Banco Central (IF.data). O score e uma metrica simplificada e nao substitui analise profissional. Consulte um especialista antes de tomar decisoes financeiras.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ScoreItem({ label, value, unit, points, maxPoints, description, good, warning, icon, media, inverted }: {
  label: string; value: number; unit: string; points: number; maxPoints: number;
  description: string; good: boolean; warning: boolean; icon: React.ReactNode; media: number; inverted?: boolean;
}) {
  const pct = (points / maxPoints) * 100;
  const barColor = good ? 'bg-accent' : warning ? 'bg-yellow-500' : 'bg-destructive';
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">{icon} {label}</div>
        <span className="text-xs text-muted-foreground">{points}/{maxPoints} pts</span>
      </div>
      <div className="mb-2 text-2xl font-bold text-foreground">{value}{unit}</div>
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mb-1 text-xs text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground/60">Media do setor: {media.toFixed(1)}%{inverted ? ' (quanto menor, melhor)' : ' (quanto maior, melhor)'}</p>
    </div>
  );
}

function IndicatorCard({ icon, label, value, sublabel, description }: { icon: React.ReactNode; label: string; value: string; sublabel: string; description?: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-5">
      <div className="mb-2 flex items-center gap-2">{icon}<span className="text-sm text-muted-foreground">{label}</span></div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
      {sublabel && <p className="mt-1 text-xs font-medium text-primary">{sublabel}</p>}
      {description && <p className="mt-1 text-xs text-muted-foreground/60">{description}</p>}
    </div>
  );
}

function RatingCard({ agency, rating, description }: { agency: string; rating: string; description: string }) {
  if (!rating) return (
    <div className="rounded-lg border border-dashed border-border p-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">{agency}</p>
      <p className="mt-1 text-lg text-muted-foreground/50">N/D</p>
    </div>
  );
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">{agency}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{rating}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function getMoodysDescription(r: string): string {
  if (!r) return '';
  const m: Record<string, string> = { 'Aaa': 'Qualidade maxima', 'Aa1': 'Alta qualidade', 'Aa2': 'Alta qualidade', 'Aa3': 'Alta qualidade', 'A1': 'Grau medio-alto', 'A2': 'Grau medio-alto', 'A3': 'Grau medio-alto', 'Baa1': 'Grau medio', 'Baa2': 'Grau medio', 'Baa3': 'Grau medio', 'Ba1': 'Especulativo', 'Ba2': 'Especulativo', 'Ba3': 'Especulativo', 'B1': 'Alto risco', 'B2': 'Alto risco', 'B3': 'Alto risco' };
  return m[r] || 'Rating atribuido';
}
function getFitchDescription(r: string): string {
  if (!r) return '';
  const m: Record<string, string> = { 'AAA': 'Qualidade maxima', 'AA+': 'Qualidade muito alta', 'AA': 'Qualidade muito alta', 'AA-': 'Qualidade muito alta', 'A+': 'Qualidade alta', 'A': 'Qualidade alta', 'A-': 'Qualidade alta', 'BBB+': 'Grau de investimento', 'BBB': 'Grau de investimento', 'BBB-': 'Grau de investimento', 'BB+': 'Especulativo', 'BB': 'Especulativo', 'BB-': 'Especulativo', 'B+': 'Alto risco', 'B': 'Alto risco' };
  return m[r] || 'Rating atribuido';
}
function getSPDescription(r: string): string {
  if (!r) return '';
  const m: Record<string, string> = { 'AAA': 'Qualidade maxima', 'AA+': 'Muito alta', 'AA': 'Muito alta', 'AA-': 'Muito alta', 'A+': 'Alta', 'A': 'Alta', 'A-': 'Alta', 'BBB+': 'Investimento', 'BBB': 'Investimento', 'BBB-': 'Investimento', 'BB+': 'Especulativo', 'BB': 'Especulativo', 'BB-': 'Especulativo', 'B+': 'Alto risco', 'b': 'Alto risco' };
  return m[r] || 'Rating atribuido';
}
