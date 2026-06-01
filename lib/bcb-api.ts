// API do Banco Central - IF.data via OData
const BCB_BASE_URL = 'https://olinda.bcb.gov.br/olinda/servico/IFDATA/versao/v1/odata';

export interface Instituicao {
  CodInst: string;
  NomeInstituicao: string;
  Segmento: string;
  TipoConsolidacao: string;
}

export interface IndicadorFinanceiro {
  CodInst: string;
  NomeInstituicao: string;
  DataBase: string;
  Indicador: string;
  Valor: number;
  Segmento: string;
}

export interface ResumoIndicadores {
  instituicao: string;
  codInst: string;
  segmento: string;
  dataBase: string;
  taxaImobilizacao: number | null;
  indiceBasileia: number | null;
  roa: number | null;
  roe: number | null;
  liquidezGeral: number | null;
  ativoTotal: number | null;
}

// Buscar lista de instituições
export async function fetchInstituicoes(): Promise<Instituicao[]> {
  try {
    const url = `${BCB_BASE_URL}/IfDataCadastro?$format=json&$orderby=NomeInstituicao&$top=500`;
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache 24h
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.value || [];
  } catch (error) {
    console.error('Erro ao buscar instituições:', error);
    return [];
  }
}

// Buscar indicadores de uma instituição específica
export async function fetchIndicadores(codInst: string, dataBase?: string): Promise<IndicadorFinanceiro[]> {
  try {
    let url = `${BCB_BASE_URL}/IfDataValor?$format=json&$filter=CodInst eq '${codInst}'`;
    
    if (dataBase) {
      url += ` and DataBase eq '${dataBase}'`;
    }
    
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1h
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.value || [];
  } catch (error) {
    console.error('Erro ao buscar indicadores:', error);
    return [];
  }
}

// Buscar dados resumidos dos maiores bancos
export async function fetchTopBancos(): Promise<ResumoIndicadores[]> {
  try {
    // Buscar bancos do segmento S1 (maiores bancos)
    const url = `${BCB_BASE_URL}/IfDataIndicadores(Segmento='S1')?$format=json&$top=100`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return processarIndicadores(data.value || []);
  } catch (error) {
    console.error('Erro ao buscar top bancos:', error);
    return getMockData();
  }
}

// Buscar taxa de imobilização por segmento
export async function fetchTaxaImobilizacao(): Promise<{ segmento: string; taxa: number }[]> {
  try {
    const url = `${BCB_BASE_URL}/IfDataIndicadores?$format=json&$filter=Indicador eq 'Taxa de Imobilização'&$top=50`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return (data.value || []).map((item: IndicadorFinanceiro) => ({
      segmento: item.Segmento,
      taxa: item.Valor
    }));
  } catch (error) {
    console.error('Erro ao buscar taxa de imobilização:', error);
    return [];
  }
}

function processarIndicadores(dados: IndicadorFinanceiro[]): ResumoIndicadores[] {
  const grouped = new Map<string, Partial<ResumoIndicadores>>();
  
  dados.forEach(item => {
    if (!grouped.has(item.CodInst)) {
      grouped.set(item.CodInst, {
        instituicao: item.NomeInstituicao,
        codInst: item.CodInst,
        segmento: item.Segmento,
        dataBase: item.DataBase,
      });
    }
    
    const banco = grouped.get(item.CodInst)!;
    
    switch (item.Indicador.toLowerCase()) {
      case 'taxa de imobilização':
        banco.taxaImobilizacao = item.Valor;
        break;
      case 'índice de basileia':
      case 'indice de basileia':
        banco.indiceBasileia = item.Valor;
        break;
      case 'roa':
      case 'retorno sobre ativo':
        banco.roa = item.Valor;
        break;
      case 'roe':
      case 'retorno sobre patrimônio':
        banco.roe = item.Valor;
        break;
      case 'liquidez geral':
        banco.liquidezGeral = item.Valor;
        break;
      case 'ativo total':
        banco.ativoTotal = item.Valor;
        break;
    }
  });
  
  return Array.from(grouped.values()) as ResumoIndicadores[];
}

// Dados mock para quando a API não responder
function getMockData(): ResumoIndicadores[] {
  return [
    {
      instituicao: 'Itaú Unibanco',
      codInst: '60701190',
      segmento: 'S1',
      dataBase: '2024-09',
      taxaImobilizacao: 4.2,
      indiceBasileia: 15.8,
      roa: 1.8,
      roe: 21.5,
      liquidezGeral: 1.35,
      ativoTotal: 2456789000000,
    },
    {
      instituicao: 'Banco do Brasil',
      codInst: '00000000',
      segmento: 'S1',
      dataBase: '2024-09',
      taxaImobilizacao: 5.1,
      indiceBasileia: 16.2,
      roa: 1.5,
      roe: 19.8,
      liquidezGeral: 1.42,
      ativoTotal: 2198765000000,
    },
    {
      instituicao: 'Bradesco',
      codInst: '60746948',
      segmento: 'S1',
      dataBase: '2024-09',
      taxaImobilizacao: 4.8,
      indiceBasileia: 15.1,
      roa: 1.3,
      roe: 16.2,
      liquidezGeral: 1.28,
      ativoTotal: 1987654000000,
    },
    {
      instituicao: 'Santander Brasil',
      codInst: '90400888',
      segmento: 'S1',
      dataBase: '2024-09',
      taxaImobilizacao: 3.9,
      indiceBasileia: 14.9,
      roa: 1.6,
      roe: 18.4,
      liquidezGeral: 1.31,
      ativoTotal: 1123456000000,
    },
    {
      instituicao: 'Caixa Econômica Federal',
      codInst: '00360305',
      segmento: 'S1',
      dataBase: '2024-09',
      taxaImobilizacao: 6.2,
      indiceBasileia: 17.5,
      roa: 0.9,
      roe: 12.1,
      liquidezGeral: 1.48,
      ativoTotal: 1876543000000,
    },
    {
      instituicao: 'BTG Pactual',
      codInst: '30306294',
      segmento: 'S1',
      dataBase: '2024-09',
      taxaImobilizacao: 2.1,
      indiceBasileia: 18.3,
      roa: 2.4,
      roe: 24.6,
      liquidezGeral: 1.52,
      ativoTotal: 654321000000,
    },
    {
      instituicao: 'Safra',
      codInst: '58160789',
      segmento: 'S1',
      dataBase: '2024-09',
      taxaImobilizacao: 3.5,
      indiceBasileia: 16.8,
      roa: 1.9,
      roe: 20.2,
      liquidezGeral: 1.39,
      ativoTotal: 432198000000,
    },
    {
      instituicao: 'Nubank',
      codInst: '18236120',
      segmento: 'S2',
      dataBase: '2024-09',
      taxaImobilizacao: 1.8,
      indiceBasileia: 22.1,
      roa: 3.2,
      roe: 28.9,
      liquidezGeral: 1.65,
      ativoTotal: 198765000000,
    },
  ];
}

// Função para formatar valores monetários
export function formatCurrency(value: number): string {
  if (value >= 1e12) {
    return `R$ ${(value / 1e12).toFixed(2)} tri`;
  } else if (value >= 1e9) {
    return `R$ ${(value / 1e9).toFixed(2)} bi`;
  } else if (value >= 1e6) {
    return `R$ ${(value / 1e6).toFixed(2)} mi`;
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Função para determinar status de saúde baseado em indicadores
export function getHealthStatus(resumo: ResumoIndicadores): 'excellent' | 'good' | 'warning' | 'danger' {
  const scores: number[] = [];
  
  // Taxa de imobilização (menor é melhor, máx 50%)
  if (resumo.taxaImobilizacao !== null) {
    if (resumo.taxaImobilizacao <= 20) scores.push(100);
    else if (resumo.taxaImobilizacao <= 35) scores.push(70);
    else if (resumo.taxaImobilizacao <= 50) scores.push(40);
    else scores.push(10);
  }
  
  // Índice de Basileia (maior é melhor, mín 10.5%)
  if (resumo.indiceBasileia !== null) {
    if (resumo.indiceBasileia >= 15) scores.push(100);
    else if (resumo.indiceBasileia >= 12) scores.push(70);
    else if (resumo.indiceBasileia >= 10.5) scores.push(40);
    else scores.push(10);
  }
  
  // ROE (maior é melhor)
  if (resumo.roe !== null) {
    if (resumo.roe >= 18) scores.push(100);
    else if (resumo.roe >= 12) scores.push(70);
    else if (resumo.roe >= 6) scores.push(40);
    else scores.push(10);
  }
  
  if (scores.length === 0) return 'warning';
  
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  if (avgScore >= 85) return 'excellent';
  if (avgScore >= 60) return 'good';
  if (avgScore >= 35) return 'warning';
  return 'danger';
}
