import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Termos de Uso | Radar Bancário',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Termos de Uso</h1>
        <p className="mb-4 text-sm text-muted-foreground">Última atualização: 03 de junho de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Aceitação dos termos</h2>
            <p>Ao acessar e utilizar o site Radar Bancário (<strong>meuradarbancario.com.br</strong>), você concorda integralmente com estes Termos de Uso. Se não concordar com algum dos termos, por favor, não utilize o site.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Descrição do serviço</h2>
            <p>O Radar Bancário é uma plataforma gratuita que apresenta indicadores de saúde financeira de instituições bancárias brasileiras, incluindo:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Índice de Basileia</li>
              <li>Taxa de Imobilização</li>
              <li>Alavancagem de Captação (Funding/Capital)</li>
              <li>Cobertura Prudencial (AR estimado / VR estimado)</li>
              <li>Ratings de agências internacionais (Moody's, Fitch, S&P)</li>
              <li>Score de saúde financeira</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Fonte dos dados</h2>
            <p>Todos os dados financeiros apresentados são extraídos de fontes públicas oficiais, principalmente:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>Banco Central do Brasil</strong> — Sistema IF.data (Conglomerado Prudencial), acessado via API OData.</li>
              <li><strong>Agências de rating</strong> — Informações públicas divulgadas por Moody's, Fitch Ratings e Standard & Poor's.</li>
              <li><strong>Relatórios de RI</strong> — Dados de Relações com Investidores das próprias instituições.</li>
            </ul>
            <p className="mt-2">Os dados são atualizados periodicamente conforme a disponibilidade das fontes oficiais.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Isenção de responsabilidade</h2>
            <p className="mb-2"><strong>IMPORTANTE:</strong> O Radar Bancário NÃO presta consultoria financeira, de investimentos ou de qualquer natureza. As informações apresentadas têm caráter exclusivamente informativo e educacional.</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>O score de saúde financeira é uma métrica simplificada criada para fins didáticos e NÃO constitui recomendação de investimento.</li>
              <li>Os indicadores prudenciais seguem a metodologia do Banco Central, mas a interpretação pode variar conforme o tipo de instituição (bancos públicos, de desenvolvimento e cooperativas possuem características próprias).</li>
              <li>Não garantimos a precisão, completude ou atualização dos dados em tempo real.</li>
              <li>Decisões financeiras devem ser tomadas com o auxílio de profissionais qualificados (consultores CVM, planejadores financeiros certificados, etc.).</li>
              <li>O Radar Bancário não se responsabiliza por eventuais perdas ou danos decorrentes do uso das informações apresentadas.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Propriedade intelectual</h2>
            <p>O layout, design, logotipo, textos originais e código-fonte do site são de propriedade do Radar Bancário. Os dados financeiros são de domínio público, disponibilizados pelo Banco Central do Brasil. É proibida a reprodução total ou parcial do conteúdo original sem autorização prévia.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Uso aceitável</h2>
            <p className="mb-2">Ao utilizar o site, você concorda em:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Não utilizar o site para fins ilegais ou não autorizados.</li>
              <li>Não tentar acessar áreas restritas ou interferir no funcionamento do site.</li>
              <li>Não realizar scraping, mineração de dados ou coleta automatizada sem autorização.</li>
              <li>Não reproduzir o conteúdo para fins comerciais sem autorização.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Publicidade</h2>
            <p>O site pode exibir anúncios fornecidos pelo Google AdSense e/ou parceiros. O Radar Bancário não se responsabiliza pelo conteúdo dos anúncios de terceiros. A exibição de um anúncio não constitui endosso ou recomendação do produto ou serviço anunciado.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Links externos</h2>
            <p>O site pode conter links para sites de terceiros (Banco Central, instituições financeiras, etc.). Não nos responsabilizamos pelo conteúdo, políticas de privacidade ou práticas desses sites.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Disponibilidade</h2>
            <p>Nos esforçaremos para manter o site disponível 24 horas por dia, mas não garantimos disponibilidade ininterrupta. O site pode ser temporariamente indisponível para manutenção, atualização ou por motivos fora do nosso controle.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">10. Alterações nos termos</h2>
            <p>Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entram em vigor imediatamente após a publicação. O uso continuado do site após alterações constitui aceitação dos novos termos.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">11. Legislação aplicável</h2>
            <p>Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será submetida ao foro da comarca de domicílio do usuário, conforme o Código de Defesa do Consumidor (Lei 8.078/1990).</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">12. Contato</h2>
            <p>Para dúvidas sobre estes termos, entre em contato pelo e-mail: <strong>contato@meuradarbancario.com.br</strong></p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
