export function basileiaStatus(v: number): { classificacao: string; cor: 'green' | 'yellow' | 'red' } {
  if (v >= 13) return { classificacao: 'Bom', cor: 'green' };
  if (v >= 10.5) return { classificacao: 'Atenção', cor: 'yellow' };
  return { classificacao: 'Crítico', cor: 'red' };
}

export function imobilizacaoStatus(v: number): { classificacao: string; cor: 'green' | 'yellow' | 'red' } {
  if (v <= 25) return { classificacao: 'Bom', cor: 'green' };
  if (v <= 50) return { classificacao: 'Atenção', cor: 'yellow' };
  return { classificacao: 'Crítico', cor: 'red' };
}

export const BASILEIA_ZONES = [
  { min: 0, max: 10.5, color: '#ef4444' },
  { min: 10.5, max: 13, color: '#f97316' },
  { min: 13, max: 100, color: '#22c55e' },
];

export const IMOBILIZACAO_ZONES = [
  { min: 0, max: 25, color: '#22c55e' },
  { min: 25, max: 50, color: '#f97316' },
  { min: 50, max: 100, color: '#ef4444' },
];
