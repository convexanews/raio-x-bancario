import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getBancos } from '@/lib/bcb-api';
import { MeuBancoClient } from '@/components/meu-banco-client';

export const metadata = {
  title: 'Meu Banco é Seguro? Descubra Agora | Radar Bancário',
  description: 'Digite o nome do seu banco e descubra em segundos se ele é seguro financeiramente. Análise baseada em dados oficiais do Banco Central do Brasil.',
};

export default function MeuBancoPage() {
  const bancos = getBancos().filter(b => b.score > 0);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MeuBancoClient bancos={bancos} />
      <Footer />
    </div>
  );
}
