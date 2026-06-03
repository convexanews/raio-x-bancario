import { Radar, ExternalLink, Database, Shield } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer id="sobre" className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Radar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Radar <span className="text-primary">Bancario</span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
              Plataforma de análise de saúde financeira dos bancos brasileiros com dados oficiais do Banco Central. 
              Tome decisões informadas sobre onde guardar seu dinheiro.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://www3.bcb.gov.br/ifdata/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Database className="h-4 w-4" />
                IF.data BCB
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://www.bcb.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Shield className="h-4 w-4" />
                Banco Central
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Navegação</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Início</Link></li>
              <li><Link href="/meu-banco" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Meu Banco</Link></li>
              <li><Link href="/bancos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Ranking dos Bancos</Link></li>
              <li><Link href="/comparar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Comparador</Link></li>
              <li><Link href="/ranking" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Bancos Mais Seguros</Link></li>
              <li><Link href="/calculadora-fgc" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Calculadora FGC</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Perguntas Frequentes</Link></li>
              <li><Link href="/metodologia" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Metodologia</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Informações</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/termos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/metodologia" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Metodologia
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer principal */}
        <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">⚠️ Aviso Legal Importante</p>
          <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Transparência de dados públicos:</strong> Este site reproduz exclusivamente dados oficiais
              disponibilizados pelo <strong className="text-foreground">Banco Central do Brasil</strong> por meio do sistema público IF.data
              (Lei de Acesso à Informação — Lei nº 12.527/2011). Todos os indicadores apresentados — Índice de Basileia, Taxa de Imobilização,
              Patrimônio de Referência, RWA e demais — são calculados conforme a metodologia regulatória do próprio Banco Central
              (Resolução CMN 4.958/2021 e normas correlatas).
            </p>
            <p>
              <strong className="text-foreground">Não é recomendação:</strong> As informações, scores e classificações apresentadas têm
              <strong className="text-foreground"> caráter exclusivamente informativo e educacional</strong>. Não constituem recomendação de
              investimento, consultoria financeira, análise de valores mobiliários ou qualquer forma de aconselhamento regulado pela CVM
              (Comissão de Valores Mobiliários) ou pelo Banco Central do Brasil.
            </p>
            <p>
              <strong className="text-foreground">Interpretação dos dados:</strong> Um score mais baixo reflete apenas a posição relativa
              do banco em indicadores regulatórios públicos — não implica insolvência, irregularidade ou qualquer juízo de valor sobre
              a instituição. Bancos de desenvolvimento, cooperativas e instituições com características operacionais específicas podem
              apresentar indicadores atípicos por sua natureza, sem que isso represente risco adicional.
            </p>
            <p>
              <strong className="text-foreground">Defasagem temporal:</strong> Os dados são publicados pelo Banco Central com defasagem
              de 60 a 90 dias após o período de referência. A situação atual de cada instituição pode ser diferente dos dados exibidos.
            </p>
            <p>
              Antes de tomar qualquer decisão financeira, consulte um <strong className="text-foreground">profissional certificado</strong>
              (assessor de investimentos credenciado pela ANCORD/CVM, planejador financeiro CFP ou consultor regulado).
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Radar Bancário. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Dados: IF.data BCB — dez/2025 · Atualização trimestral
          </p>
        </div>
      </div>
    </footer>
  );
}
