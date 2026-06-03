import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Politica de Privacidade | Radar Bancario',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Politica de Privacidade</h1>
        <p className="mb-4 text-sm text-muted-foreground">Ultima atualizacao: 03 de junho de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Introducao</h2>
            <p>O Radar Bancario (<strong>meuradarbancario.com.br</strong>) e uma plataforma gratuita de analise de saude financeira dos bancos brasileiros, utilizando dados publicos do Banco Central do Brasil (IF.data). Esta Politica de Privacidade descreve como coletamos, usamos e protegemos as informacoes dos visitantes.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Dados que coletamos</h2>
            <p className="mb-2">Podemos coletar os seguintes tipos de informacoes:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>Dados de navegacao:</strong> endereco IP, tipo de navegador, paginas acessadas, tempo de permanencia, obtidos automaticamente por meio de cookies e tecnologias semelhantes.</li>
              <li><strong>Dados do Google Analytics:</strong> informacoes anonimizadas sobre o uso do site para fins estatisticos.</li>
              <li><strong>Dados do Google AdSense:</strong> cookies de publicidade para exibir anuncios relevantes. O Google pode coletar dados conforme sua propria politica de privacidade.</li>
              <li><strong>Dados de preferencia:</strong> tema claro/escuro, armazenado localmente no seu navegador (localStorage).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Como usamos os dados</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Melhorar a experiencia de navegacao e o conteudo do site.</li>
              <li>Gerar estatisticas anonimas de acesso.</li>
              <li>Exibir anuncios personalizados por meio do Google AdSense.</li>
              <li>Garantir o funcionamento tecnico da plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Cookies</h2>
            <p className="mb-2">O site utiliza cookies para:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>Cookies essenciais:</strong> necessarios para o funcionamento basico do site.</li>
              <li><strong>Cookies de analise:</strong> Google Analytics para entender como os usuarios interagem com o site.</li>
              <li><strong>Cookies de publicidade:</strong> Google AdSense para exibir anuncios relevantes. Voce pode gerenciar seus cookies nas configuracoes do navegador.</li>
            </ul>
            <p className="mt-2">Voce pode desativar cookies nas configuracoes do seu navegador, mas isso pode afetar a funcionalidade do site.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Compartilhamento de dados</h2>
            <p>Nao vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Google (Analytics e AdSense) para fins de analise e publicidade.</li>
              <li>Vercel (hospedagem) para o funcionamento tecnico do site.</li>
              <li>Quando exigido por lei ou ordem judicial.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Seguranca</h2>
            <p>Adotamos medidas tecnicas e organizacionais para proteger os dados contra acesso nao autorizado, alteracao, divulgacao ou destruicao. O site utiliza conexao segura (HTTPS/SSL).</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Seus direitos (LGPD)</h2>
            <p className="mb-2">Conforme a Lei Geral de Protecao de Dados (Lei 13.709/2018), voce tem direito a:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Confirmar a existencia de tratamento de dados.</li>
              <li>Acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos ou desatualizados.</li>
              <li>Solicitar a anonimizacao, bloqueio ou eliminacao de dados.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Dados de terceiros</h2>
            <p>Os dados financeiros exibidos neste site sao informacoes publicas disponibilizadas pelo Banco Central do Brasil atraves do sistema IF.data. Nao coletamos nem armazenamos dados pessoais dos clientes das instituicoes financeiras analisadas.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Alteracoes nesta politica</h2>
            <p>Reservamo-nos o direito de alterar esta Politica de Privacidade a qualquer momento. As alteracoes entram em vigor imediatamente apos a publicacao nesta pagina.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">10. Contato</h2>
            <p>Para duvidas sobre esta politica ou exercer seus direitos, entre em contato pelo e-mail: <strong>contato@meuradarbancario.com.br</strong></p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
