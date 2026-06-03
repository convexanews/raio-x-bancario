'use client';

import { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Linkedin } from 'lucide-react';

interface ShareButtonProps {
  banco: string;
  score: number;
  basileia: number;
  situacao: string;
}

export function ShareButton({ banco, score, basileia, situacao }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const emoji = situacao === 'verde' ? '✅' : situacao === 'amarelo' ? '⚠️' : '🔴';
  const statusLabel = situacao === 'verde' ? 'Saudável' : situacao === 'amarelo' ? 'Atenção' : 'Crítico';

  const texto = `${emoji} ${banco} — Score ${score}/100 (${statusLabel})\nBasileia: ${basileia}%\nVeja a análise completa baseada em dados do Banco Central:\n${url}`;
  const textoWhats = encodeURIComponent(texto);
  const textoLinkedin = encodeURIComponent(url);

  const copiar = async () => {
    await navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativo = async () => {
    if (navigator.share) {
      await navigator.share({ title: `${banco} — Radar Bancário`, text: texto, url });
    } else {
      setOpen(!open);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={nativo}
        className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition"
      >
        <Share2 className="h-4 w-4" /> Compartilhar
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-background shadow-lg p-2">
          <a
            href={`https://wa.me/?text=${textoWhats}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-secondary/50 transition text-sm"
          >
            <MessageCircle className="h-4 w-4 text-green-500" /> WhatsApp
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${textoLinkedin}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-secondary/50 transition text-sm"
          >
            <Linkedin className="h-4 w-4 text-blue-600" /> LinkedIn
          </a>
          <button
            onClick={copiar}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-secondary/50 transition text-sm"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado!' : 'Copiar link'}
          </button>
        </div>
      )}
    </div>
  );
}
