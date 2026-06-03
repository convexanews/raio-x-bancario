import raioxData from '@/data/raiox.json';

export interface BancoRaioX {
  nome: string;
  nome_bcb: string;
  tipo: string;
  basileia: number;
  imobilizacao: number;
  funding_capital: number;
  cobertura_prudencial: number;
  patrimonio_liquido: number;
  ativo_total?: number;
  rwa?: number;
  pr?: number;
  capital_principal?: number;
  capital_nivel1?: number;
  razao_alavancagem?: number;
  carteira_credito?: number;
  depositos_total?: number;
  captacoes_total?: number;
  lucro_liquido?: number;
  tvm?: number;
  vr_estimado?: number;
  ar_estimado?: number;
  score: number;
  situacao: 'verde' | 'amarelo' | 'vermelho';
  rating_moodys: string;
  rating_fitch: string;
  rating_sp: string;
  rating_perspectiva: string;
  rating_fonte: string;
  fonte_dados: string;
}

export interface RaioXData {
  atualizado_em: string;
  fonte: string;
  periodo: string;
  nota: string;
  total: number;
  bancos: BancoRaioX[];
}

export function getRaioXData(): RaioXData {
  return raioxData as unknown as RaioXData;
}

export function getBancos(): BancoRaioX[] {
  return raioxData.bancos as unknown as BancoRaioX[];
}

export function getHealthStatus(banco: BancoRaioX): 'excellent' | 'good' | 'warning' | 'danger' {
  if (banco.score >= 90) return 'excellent';
  if (banco.score >= 70) return 'good';
  if (banco.score >= 50) return 'warning';
  return 'danger';
}

export function formatCurrency(value: number): string {
  if (value >= 1e12) return `R$ ${(value / 1e12).toFixed(2)} tri`;
  if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(2)} bi`;
  if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(2)} mi`;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function getSituacaoLabel(situacao: string): string {
  switch (situacao) {
    case 'verde': return 'Saudável';
    case 'amarelo': return 'Atenção';
    case 'vermelho': return 'Crítico';
    default: return 'N/D';
  }
}
