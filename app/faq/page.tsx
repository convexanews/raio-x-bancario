import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ChevronDown } from 'lucide-react';

export const metadata = {
  title: 'Perguntas Frequentes sobre Segurança Bancária | Radar Bancário',
  description: 'O que é Basileia? Meu dinheiro está seguro no banco? O que é o FGC? Respondemos as principais dúvidas sobre segurança bancária com base nos dados do Banco Central.',
};

const FAQS = [
  {
    cat: 'Segurança do seu dinheiro',
    perguntas: [
      {
        q: 'Meu dinheiro está seguro no banco?',
        a: 'Em geral, sim. O Brasil tem o FGC (Fundo Garantidor de Créditos), que protege até R$250 mil por CPF por instituição financeira em caso de falência. Isso cobre depósitos à vista, CDB, poupança e outros produtos. Além disso, o Banco Central monitora todos os bancos por meio de indicadores como o Índice de Basileia, que mede a capacidade do banco de absorver perdas.',
      },
      {
        q: 'O que acontece se um banco quebrar?',
        a: 'O Banco Central pode decretar intervenção, liquidação extrajudicial ou RAET (regime especial). O FGC entra em ação para pagar depositantes com saldo de até R$250 mil por CPF por instituição, com limite global de R$1 milhão a cada 4 anos. Valores acima desse limite ficam sujeitos ao processo de liquidação.',
      },
      {
        q: 'Qual é o limite de proteção do FGC?',
        a: 'R$250 mil por CPF/CNPJ por conglomerado financeiro. Se você tem R$400 mil em um banco que quebra, R$250 mil são cobertos pelo FGC e os outros R$150 mil entram na fila de credores. Importante: o limite é por conglomerado, então Itaú e Personnalité, por exemplo, fazem parte do mesmo grupo.',
      },
      {
        q: 'Banco digital é tão seguro quanto banco tradicional?',
        a: 'Sim, desde que seja autorizado pelo Banco Central. Todos os bancos listados neste site são instituições reguladas pelo BCB. A diferença é que bancos digitais costumam ter Índice de Basileia mais alto (mais capital em relação ao risco) porque operam com menos ativos fixos e carteiras de crédito menores.',
      },
    ],
  },
  {
    cat: 'Entendendo os indicadores',
    perguntas: [
      {
        q: 'O que é o Índice de Basileia?',
        a: 'É a principal medida de solidez financeira de um banco. Calculado como Patrimônio de Referência ÷ Ativos Ponderados pelo Risco (RWA). Quanto maior, mais capital próprio o banco tem para absorver perdas. O Banco Central exige mínimo de 10,5% (Basileia III). Bancos saudáveis operam acima de 13%, e os mais capitalizados acima de 15%.',
      },
      {
        q: 'O que é a Taxa de Imobilização?',
        a: 'Mede quanto do patrimônio do banco está "preso" em ativos fixos (imóveis, equipamentos, participações). Quanto menor, mais liquidez o banco tem para operar. O Banco Central limita em 50% do Patrimônio de Referência. Taxas abaixo de 10% são excelentes; acima de 30% merecem atenção.',
      },
      {
        q: 'O que é o Score de Saúde Financeira?',
        a: 'É uma métrica simplificada criada pelo Radar Bancário para facilitar a interpretação. Combina o Índice de Basileia (até 50 pontos) e a Taxa de Imobilização (até 50 pontos). Score de 80-100 é saudável, 60-79 merece atenção, abaixo de 60 é crítico. Não é uma métrica oficial do Banco Central.',
      },
      {
        q: 'O que são os novos indicadores FGC (AR e VR)?',
        a: 'São indicadores criados pela Resolução CMN 5.295/2026 e Res. BCB 572/2026. O VR (Valor de Referência) mede a exposição potencial do FGC ao banco (estimamos como as captações totais). O AR (Ativo de Referência) mede a qualidade dos ativos (estimamos como TVM + Carteira de Crédito). Quando AR < VR, o banco precisa direcionar a diferença para títulos públicos federais. Esses dados ainda não foram publicados oficialmente pelo BCB — os valores no site são estimativas.',
      },
      {
        q: 'Por que um banco público tem score mais baixo?',
        a: 'Bancos públicos como Banco do Brasil e Caixa têm missões específicas — financiar agricultura, habitação e infraestrutura — o que pode resultar em maior imobilização ou concentração setorial. Isso não significa que são inseguros. O Banco Central monitora esses bancos com critérios diferenciados, e o governo federal atua como garantidor implícito.',
      },
    ],
  },
  {
    cat: 'Sobre os dados',
    perguntas: [
      {
        q: 'De onde vêm os dados?',
        a: 'Exclusivamente do sistema IF.data do Banco Central do Brasil, acessado via API OData pública. Os dados refletem o Conglomerado Prudencial de cada instituição, que é a visão consolidada mais completa para análise de risco. Período: dezembro/2025 (publicação trimestral com defasagem de 60-90 dias).',
      },
      {
        q: 'Com que frequência os dados são atualizados?',
        a: 'O Banco Central publica os dados trimestralmente: março, junho, setembro e dezembro. A publicação ocorre 60 dias após o fechamento de março, junho e setembro, e 90 dias após dezembro. Este site é atualizado sempre que novos dados são disponibilizados pelo BCB.',
      },
      {
        q: 'Por que alguns bancos aparecem com score diferente do esperado?',
        a: 'O score é calculado com dois indicadores (Basileia + Imobilização). Bancos com Basileia alta mas imobilização também alta podem ter score moderado. Cooperativas geralmente têm Basileia muito alta mas a imobilização pode variar. O score é uma simplificação — veja sempre os indicadores individuais para uma análise completa.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Perguntas Frequentes</h1>
          <p className="mt-3 text-muted-foreground">Tudo que você precisa saber sobre segurança bancária e os indicadores do Banco Central.</p>
        </div>

        <div className="space-y-10">
          {FAQS.map(categoria => (
            <div key={categoria.cat}>
              <h2 className="mb-4 text-lg font-bold text-primary border-b border-border pb-2">{categoria.cat}</h2>
              <div className="space-y-3">
                {categoria.perguntas.map((item, i) => (
                  <details key={i} className="group rounded-xl border border-border bg-card">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium text-foreground marker:hidden list-none">
                      {item.q}
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground border-t border-border pt-3">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 text-center">
          <Link href="/meu-banco" className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition">
            <p className="font-semibold text-foreground">Verificar meu banco</p>
            <p className="text-xs text-muted-foreground mt-1">Análise personalizada</p>
          </Link>
          <Link href="/calculadora-fgc" className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition">
            <p className="font-semibold text-foreground">Calculadora FGC</p>
            <p className="text-xs text-muted-foreground mt-1">Sua cobertura de garantia</p>
          </Link>
          <Link href="/ranking" className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition">
            <p className="font-semibold text-foreground">Bancos mais seguros</p>
            <p className="text-xs text-muted-foreground mt-1">Top 20 por score</p>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
