import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Termos de Uso | Radar Bancario',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Termos de Uso</h1>
        <p className="mb-4 text-sm text-muted-foreground">Ultima atualizacao: 03 de junho de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Aceitacao dos termos</h2>
            <p>Ao acessar e utilizar o site Radar Bancario (<strong>meuradarbancario.com.br</strong>), voce concorda integralmente com estes Termos de Uso. Se nao concordar com algum dos termos, por favor, nao utilize o site.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Descricao do servico</h2>
            <p>O Radar Bancario e uma plataforma gratuita que apresenta indicadores de saude financeira de instituicoes bancarias brasileiras, incluindo:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Indice de Basileia</li>
              <li>Taxa de Imobilizacao</li>
              <li>Alavancagem de Captacao (Funding/Capital)</li>
              <li>Exposicao ao Risco (Cobertura Prudencial)</li>
              <li>Ratings de agencias internacionais (Moodys, Fitch, S&P)</li>
              <li>Score de saude financeira</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Fonte dos dados</h2>
            <p>Todos os dados financeiros apresentados sao extraidos de fontes publicas oficiais, principalmente:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>Banco Central do Brasil</strong> — Sistema IF.data (Conglomerado Prudencial), acessado via API OData.</li>
              <li><strong>Agencias de rating</strong> — Informacoes publicas divulgadas por Moodys, Fitch Ratings e Standard & Poors.</li>
              <li><strong>Relatorios de RI</strong> — Dados de Relacoes com Investidores das proprias instituicoes.</li>
            </ul>
            <p className="mt-2">Os dados sao atualizados periodicamente conforme a disponibilidade das fontes oficiais.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Isencao de responsabilidade</h2>
            <p className="mb-2"><strong>IMPORTANTE:</strong> O Radar Bancario NAO presta consultoria financeira, de investimentos ou de qualquer natureza. As informacoes apresentadas tem carater exclusivamente informativo e educacional.</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>O score de saude financeira e uma metrica simplificada criada para fins didaticos e NAO constitui recomendacao de investimento.</li>
              <li>Os indicadores prudenciais seguem a metodologia do Banco Central, mas a interpretacao pode variar conforme o tipo de instituicao (bancos publicos, de desenvolvimento e cooperativas possuem caracteristicas proprias).</li>
              <li>Nao garantimos a precisao, completude ou atualizacao dos dados em tempo real.</li>
              <li>Decisoes financeiras devem ser tomadas com o auxilio de profissionais qualificados (consultores CVM, planejadores financeiros certificados, etc.).</li>
              <li>O Radar Bancario nao se responsabiliza por eventuais perdas ou danos decorrentes do uso das informacoes apresentadas.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Propriedade intelectual</h2>
            <p>O layout, design, logotipo, textos originais e codigo-fonte do site sao de propriedade do Radar Bancario. Os dados financeiros sao de dominio publico, disponibilizados pelo Banco Central do Brasil. E proibida a reproducao total ou parcial do conteudo original sem autorizacao previa.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Uso aceitavel</h2>
            <p className="mb-2">Ao utilizar o site, voce concorda em:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Nao utilizar o site para fins ilegais ou nao autorizados.</li>
              <li>Nao tentar acessar areas restritas ou interferir no funcionamento do site.</li>
              <li>Nao realizar scraping, mineracao de dados ou coleta automatizada sem autorizacao.</li>
              <li>Nao reproduzir o conteudo para fins comerciais sem autorizacao.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Publicidade</h2>
            <p>O site pode exibir anuncios fornecidos pelo Google AdSense e/ou parceiros. O Radar Bancario nao se responsabiliza pelo conteudo dos anuncios de terceiros. A exibicao de um anuncio nao constitui endosso ou recomendacao do produto ou servico anunciado.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Links externos</h2>
            <p>O site pode conter links para sites de terceiros (Banco Central, instituicoes financeiras, etc.). Nao nos responsabilizamos pelo conteudo, politicas de privacidade ou praticas desses sites.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Disponibilidade</h2>
            <p>Nos esforcaremos para manter o site disponivel 24 horas por dia, mas nao garantimos disponibilidade ininterrupta. O site pode ser temporariamente indisponivel para manutencao, atualizacao ou por motivos fora do nosso controle.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">10. Alteracoes nos termos</h2>
            <p>Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alteracoes entram em vigor imediatamente apos a publicacao. O uso continuado do site apos alteracoes constitui aceitacao dos novos termos.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">11. Legislacao aplicavel</h2>
            <p>Estes Termos de Uso sao regidos pelas leis da Republica Federativa do Brasil. Qualquer disputa sera submetida ao foro da comarca de domicilio do usuario, conforme o Codigo de Defesa do Consumidor (Lei 8.078/1990).</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">12. Contato</h2>
            <p>Para duvidas sobre estes termos, entre em contato pelo e-mail: <strong>contato@meuradarbancario.com.br</strong></p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
