import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CalculadoraFGCClient } from '@/components/calculadora-fgc-client';
import { getBancos } from '@/lib/bcb-api';

export const metadata = {
  title: 'Calculadora FGC — Sua Cobertura de Garantia | Radar Bancário',
  description: 'Calcule quanto do seu dinheiro está protegido pelo FGC (Fundo Garantidor de Créditos). Limite de R$250 mil por CPF por instituição financeira.',
};

export default function CalculadoraFGCPage() {
  const bancos = getBancos().filter(b => b.score > 0);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CalculadoraFGCClient bancos={bancos} />
      <Footer />
    </div>
  );
}
