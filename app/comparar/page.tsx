import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getBancos } from '@/lib/bcb-api';
import { ComparadorClient } from '@/components/comparador-client';

export const metadata = {
  title: 'Comparador de Bancos | Radar Bancário',
  description: 'Compare indicadores financeiros de até 3 bancos brasileiros lado a lado: Basileia, Imobilização, Funding e indicadores FGC.',
};

export default function ComparadorPage() {
  const bancos = getBancos().filter(b => b.score > 0);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ComparadorClient bancos={bancos} />
      </main>
      <Footer />
    </div>
  );
}
