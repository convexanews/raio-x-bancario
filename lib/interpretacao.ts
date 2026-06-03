import { type BancoRaioX } from './bcb-api';

export function gerarInterpretacao(banco: BancoRaioX, bancos: BancoRaioX[]): string[] {
  const ativos = bancos.filter(b => b.score > 0);
  const frases: string[] = [];

  const mediaBasileia = ativos.reduce((s, b) => s + b.basileia, 0) / ativos.length;
  const mediaImob = ativos.reduce((s, b) => s + b.imobilizacao, 0) / ativos.length;
  const rankingScore = ativos.sort((a, b) => b.score - a.score).findIndex(b => b.nome === banco.nome) + 1;
  const rankingBasileia = [...ativos].sort((a, b) => b.basileia - a.basileia).findIndex(b => b.nome === banco.nome) + 1;

  // 1. Basileia
  const diffBasileia = banco.basileia - mediaBasileia;
  if (banco.basileia >= 15) {
    frases.push(`O ${banco.nome} apresenta Índice de Basileia de ${banco.basileia}%, ${Math.abs(diffBasileia).toFixed(1)} p.p. acima da média dos bancos analisados (${mediaBasileia.toFixed(1)}%), indicando capitalização acima do recomendado pelo Banco Central.`);
  } else if (banco.basileia >= 10.5) {
    if (diffBasileia >= 0) {
      frases.push(`O ${banco.nome} opera com Índice de Basileia de ${banco.basileia}%, ligeiramente acima da média do setor (${mediaBasileia.toFixed(1)}%), dentro dos parâmetros do Banco Central.`);
    } else {
      frases.push(`O ${banco.nome} opera com Índice de Basileia de ${banco.basileia}%, abaixo da média do setor (${mediaBasileia.toFixed(1)}%), mas ainda dentro do mínimo regulatório exigido pelo Banco Central (10,5%).`);
    }
  } else {
    frases.push(`Atenção: o Índice de Basileia do ${banco.nome} é de ${banco.basileia}%, abaixo do mínimo regulatório de 10,5% exigido pelo Banco Central.`);
  }

  // 2. Imobilização
  if (banco.imobilizacao <= 10) {
    frases.push(`A taxa de imobilização de ${banco.imobilizacao}% é baixa, demonstrando que o banco mantém boa liquidez patrimonial e flexibilidade operacional.`);
  } else if (banco.imobilizacao <= 25) {
    frases.push(`A taxa de imobilização de ${banco.imobilizacao}% está em nível moderado, dentro dos padrões normais para o setor.`);
  } else if (banco.imobilizacao <= 50) {
    frases.push(`A taxa de imobilização de ${banco.imobilizacao}% está elevada — ${(banco.imobilizacao - mediaImob).toFixed(1)} p.p. acima da média do setor. Isso significa que uma parcela relevante do patrimônio está comprometida com ativos fixos.`);
  }

  // 3. Funding / Capital
  if (banco.funding_capital > 0) {
    if (banco.funding_capital <= 10) {
      frases.push(`A relação Captação/Capital de ${banco.funding_capital}x é conservadora, indicando baixa dependência de recursos de terceiros em relação ao capital próprio.`);
    } else if (banco.funding_capital <= 15) {
      frases.push(`A relação Captação/Capital de ${banco.funding_capital}x está em patamar moderado, dentro dos parâmetros normais para bancos do mesmo segmento.`);
    } else {
      frases.push(`A relação Captação/Capital de ${banco.funding_capital}x está entre as maiores do setor, o que requer atenção sob a ótica das novas regras do FGC (Res. BCB 572/2026).`);
    }
  }

  // 4. Cobertura Prudencial (FGC)
  if ((banco.cobertura_prudencial ?? 0) > 0) {
    if (banco.cobertura_prudencial >= 100) {
      frases.push(`Sob a nova regulamentação do FGC, a cobertura prudencial estimada é de ${banco.cobertura_prudencial.toFixed(1)}% — o Ativo de Referência supera o Valor de Referência, situação favorável às exigências da Res. BCB 572/2026.`);
    } else if (banco.cobertura_prudencial >= 70) {
      frases.push(`A cobertura prudencial estimada de ${banco.cobertura_prudencial.toFixed(1)}% indica que o Ativo de Referência cobre parcialmente o Valor de Referência. O banco pode precisar direcionar recursos adicionais para títulos públicos conforme a Res. BCB 572/2026.`);
    } else {
      frases.push(`A cobertura prudencial estimada de ${banco.cobertura_prudencial.toFixed(1)}% sugere que o Ativo de Referência está significativamente abaixo do Valor de Referência. Conforme a Res. BCB 572/2026, o banco deverá direcionar a diferença para títulos públicos federais.`);
    }
  }

  // 5. Posição no ranking
  if (rankingScore <= 10) {
    frases.push(`No ranking geral de saúde financeira, o ${banco.nome} figura entre os ${rankingScore}º colocados entre os ${ativos.length} bancos analisados.`);
  } else if (rankingBasileia <= 5) {
    frases.push(`Em termos de capitalização, o ${banco.nome} está entre os ${rankingBasileia}º com maior Índice de Basileia do setor.`);
  }

  return frases;
}

export function gerarResumoSEO(banco: BancoRaioX, bancos: BancoRaioX[]): string {
  const ativos = bancos.filter(b => b.score > 0);
  const mediaBasileia = ativos.reduce((s, b) => s + b.basileia, 0) / ativos.length;
  const status = banco.score >= 80 ? 'saudável financeiramente' : banco.score >= 60 ? 'em situação de atenção' : 'em situação crítica';

  return `O ${banco.nome} está ${status} segundo dados do Banco Central (dez/2025). Basileia de ${banco.basileia}% (média do setor: ${mediaBasileia.toFixed(1)}%), imobilização de ${banco.imobilizacao}%, score de saúde ${banco.score}/100. Análise completa com indicadores da nova regulamentação FGC.`;
}
