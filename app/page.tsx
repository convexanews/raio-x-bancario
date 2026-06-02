import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { DashboardCharts } from '@/components/dashboard-charts';
import { IndicatorsInfo } from '@/components/indicators-info';
import { AdBanner } from '@/components/ad-banner';
import { Footer } from '@/components/footer';
import { getBancos, getRaioXData } from '@/lib/bcb-api';

export default function HomePage() {
  const bancos = getBancos();
  const data = getRaioXData();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroSection atualizadoEm={data.atualizado_em} totalBancos={data.total} bancos={bancos} />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AdBanner slot="1234567890" format="horizontal" />
        </div>

        <DashboardCharts bancos={bancos} />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AdBanner slot="0987654321" format="rectangle" />
        </div>

        <IndicatorsInfo />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AdBanner slot="1122334455" format="horizontal" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
