import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Política de Privacidade | Radar Bancário',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Política de Privacidade</h1>
        <p className="mb-4 text-sm text-muted-foreground">Última atualização: 03 de junho de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Introdução</h2>
            <p>O Radar Bancário (<strong>meuradarbancario.com.br</strong>) é uma plataforma gratuita de análise de saúde financeira dos bancos brasileiros, utilizando dados públicos do Banco Central do Brasil (IF.data). Esta Política de Privacidade descreve como coletamos, usamos e protegemos as informações dos visitantes.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Dados que coletamos</h2>
            <p className="mb-2">Podemos coletar os seguintes tipos de informações:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas acessadas, tempo de permanência, obtidos automaticamente por meio de cookies e tecnologias semelhantes.</li>
              <li><strong>Dados do Google Analytics:</strong> informações anonimizadas sobre o uso do site para fins estatísticos.</li>
              <li><strong>Dados do Google AdSense:</strong> cookies de publicidade para exibir anúncios relevantes. O Google pode coletar dados conforme sua própria política de privacidade.</li>
              <li><strong>Dados de preferência:</strong> tema claro/escuro, armazenado localmente no seu navegador (localStorage).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Como usamos os dados</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Melhorar a experiência de navegação e o conteúdo do site.</li>
              <li>Gerar estatísticas anônimas de acesso.</li>
              <li>Exibir anúncios personalizados por meio do Google AdSense.</li>
              <li>Garantir o funcionamento técnico da plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Cookies</h2>
            <p className="mb-2">O site utiliza cookies para:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>Cookies essenciais:</strong> necessários para o funcionamento básico do site.</li>
              <li><strong>Cookies de análise:</strong> Google Analytics para entender como os usuários interagem com o site.</li>
              <li><strong>Cookies de publicidade:</strong> Google AdSense para exibir anúncios relevantes. Você pode gerenciar seus cookies nas configurações do navegador.</li>
            </ul>
            <p className="mt-2">Você pode desativar cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Compartilhamento de dados</h2>
            <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Google (Analytics e AdSense) para fins de análise e publicidade.</li>
              <li>Vercel (hospedagem) para o funcionamento técnico do site.</li>
              <li>Quando exigido por lei ou ordem judicial.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Segurança</h2>
            <p>Adotamos medidas técnicas e organizacionais para proteger os dados contra acesso não autorizado, alteração, divulgação ou destruição. O site utiliza conexão segura (HTTPS/SSL).</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Seus direitos (LGPD)</h2>
            <p className="mb-2">Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Confirmar a existência de tratamento de dados.</li>
              <li>Acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos ou desatualizados.</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Dados de terceiros</h2>
            <p>Os dados financeiros exibidos neste site são informações públicas disponibilizadas pelo Banco Central do Brasil através do sistema IF.data. Não coletamos nem armazenamos dados pessoais dos clientes das instituições financeiras analisadas.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Alterações nesta política</h2>
            <p>Reservamo-nos o direito de alterar esta Política de Privacidade a qualquer momento. As alterações entram em vigor imediatamente após a publicação nesta página.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">10. Contato</h2>
            <p>Para dúvidas sobre esta política ou exercer seus direitos, entre em contato pelo e-mail: <strong>contato@meuradarbancario.com.br</strong></p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
