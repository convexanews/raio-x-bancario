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
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Início
                </Link>
              </li>
              <li>
                <Link href="#bancos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Ranking dos Bancos
                </Link>
              </li>
              <li>
                <Link href="#indicadores" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Indicadores
                </Link>
              </li>
              <li>
                <Link href="#sobre" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Sobre
                </Link>
              </li>
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

        {/* Disclaimer */}
        <div className="mt-10 rounded-lg border border-border bg-secondary/50 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Aviso Legal:</strong> As informações apresentadas neste site são baseadas em dados públicos 
            disponibilizados pelo Banco Central do Brasil através do sistema IF.data. Este site não presta consultoria financeira e as 
            análises apresentadas têm caráter meramente informativo. Sempre consulte um profissional qualificado antes de tomar decisões financeiras.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Radar Bancario. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Dados atualizados trimestralmente pelo Banco Central
          </p>
        </div>
      </div>
    </footer>
  );
}
