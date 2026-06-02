import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BanksGrid } from '@/components/banks-grid';
import { AdBanner } from '@/components/ad-banner';
import { getBancos } from '@/lib/bcb-api';

export const metadata = {
  title: 'Ranking dos Bancos | Raio X Bancario',
  description: 'Ranking completo dos bancos brasileiros por score de saude financeira, indice de Basileia e taxa de imobilizacao.',
};

export default function BancosPage() {
  const bancos = getBancos();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BanksGrid bancos={bancos} />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AdBanner slot="0987654321" format="rectangle" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
