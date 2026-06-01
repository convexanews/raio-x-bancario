import { Info, AlertTriangle, CheckCircle2, TrendingUp, Shield, Percent, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function IndicatorsInfo() {
  const indicators = [
    {
      id: 'taxa-imobilizacao',
      icon: Percent,
      title: 'Taxa de Imobilização',
      description: 'Mede quanto do patrimônio líquido está comprometido com ativos imobilizados.',
      details: 'Quanto menor, melhor. O Banco Central estabelece limite máximo de 50%. Bancos com taxas muito altas têm menor liquidez para operações.',
      goodRange: '< 30%',
      warningRange: '30% - 45%',
      dangerRange: '> 45%',
    },
    {
      id: 'indice-basileia',
      icon: Shield,
      title: 'Índice de Basileia',
      description: 'Indica a capacidade do banco de absorver perdas e proteger os depositantes.',
      details: 'Quanto maior, mais seguro. O mínimo exigido pelo BCB é 10,5%. Este índice mostra a relação entre o capital próprio e os riscos assumidos.',
      goodRange: '> 15%',
      warningRange: '10,5% - 15%',
      dangerRange: '< 10,5%',
    },
    {
      id: 'roe',
      icon: TrendingUp,
      title: 'ROE (Retorno sobre Patrimônio)',
      description: 'Mede a eficiência do banco em gerar lucro com o capital dos acionistas.',
      details: 'Quanto maior, mais rentável. Um ROE saudável para bancos brasileiros fica geralmente acima de 15%. Indica a capacidade de geração de valor.',
      goodRange: '> 18%',
      warningRange: '10% - 18%',
      dangerRange: '< 10%',
    },
    {
      id: 'roa',
      icon: BarChart2,
      title: 'ROA (Retorno sobre Ativos)',
      description: 'Indica quanto lucro o banco gera para cada real em ativos.',
      details: 'Quanto maior, mais eficiente. Um ROA acima de 1,5% é considerado bom para o setor bancário brasileiro.',
      goodRange: '> 1,5%',
      warningRange: '0,8% - 1,5%',
      dangerRange: '< 0,8%',
    },
  ];

  return (
    <section id="indicadores" className="border-t border-border bg-secondary/30 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
            <Info className="h-7 w-7 text-primary" />
            Entenda os Indicadores
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
            Aprenda a interpretar os principais indicadores de saúde financeira dos bancos para tomar decisões mais informadas.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {indicators.map(indicator => (
            <Card key={indicator.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <indicator.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{indicator.title}</CardTitle>
                    <CardDescription className="mt-1">{indicator.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="details" className="border-border">
                    <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground">
                      Ver detalhes e faixas de referência
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4 text-sm text-muted-foreground">{indicator.details}</p>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Bom: {indicator.goodRange}
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-warning/20 px-3 py-1 text-xs font-medium text-warning">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Atenção: {indicator.warningRange}
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-destructive/20 px-3 py-1 text-xs font-medium text-destructive">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Crítico: {indicator.dangerRange}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
