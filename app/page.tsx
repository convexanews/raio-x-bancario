import { Suspense } from 'react';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { BanksGrid } from '@/components/banks-grid';
import { DashboardCharts } from '@/components/dashboard-charts';
import { IndicatorsInfo } from '@/components/indicators-info';
import { AdBanner } from '@/components/ad-banner';
import { Footer } from '@/components/footer';
import { fetchTopBancos, type ResumoIndicadores } from '@/lib/bcb-api';
import { Spinner } from '@/components/ui/spinner';

async function getBancos(): Promise<ResumoIndicadores[]> {
  const bancos = await fetchTopBancos();
  return bancos;
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Carregando dados do Banco Central...</p>
      </div>
    </div>
  );
}

async function BanksContent() {
  const bancos = await getBancos();
  
  return (
    <>
      <DashboardCharts bancos={bancos} />
      <BanksGrid bancos={bancos} />
    </>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        
        {/* Ad Banner - Top */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AdBanner slot="1234567890" format="horizontal" />
        </div>
        
        <Suspense fallback={<LoadingSpinner />}>
          <BanksContent />
        </Suspense>
        
        {/* Ad Banner - Middle */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AdBanner slot="0987654321" format="rectangle" />
        </div>
        
        <IndicatorsInfo />
        
        {/* Ad Banner - Bottom */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AdBanner slot="1122334455" format="horizontal" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
