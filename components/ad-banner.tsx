'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        initialized.current = true;
      }
    } catch (error) {
      console.error('Erro ao carregar anúncio:', error);
    }
  }, []);

  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Substituir pelo seu ID do AdSense
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {/* Placeholder visual para desenvolvimento */}
      <div className="flex min-h-[100px] items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 text-sm text-muted-foreground">
        <span>Espaço para Anúncio</span>
      </div>
    </div>
  );
}
