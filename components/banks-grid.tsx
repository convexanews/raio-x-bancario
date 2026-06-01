'use client';

import { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Filter, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BankCard } from '@/components/bank-card';
import { type ResumoIndicadores } from '@/lib/bcb-api';

interface BanksGridProps {
  bancos: ResumoIndicadores[];
}

type SortKey = 'instituicao' | 'taxaImobilizacao' | 'indiceBasileia' | 'roe' | 'ativoTotal';
type SortOrder = 'asc' | 'desc';

export function BanksGrid({ bancos }: BanksGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('ativoTotal');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [segmentoFilter, setSegmentoFilter] = useState<string>('all');

  const filteredAndSortedBancos = useMemo(() => {
    let result = [...bancos];

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.instituicao.toLowerCase().includes(term)
      );
    }

    // Filtrar por segmento
    if (segmentoFilter !== 'all') {
      result = result.filter(b => b.segmento === segmentoFilter);
    }

    // Ordenar
    result.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      // Handle null values
      if (aVal === null) aVal = sortOrder === 'asc' ? Infinity : -Infinity;
      if (bVal === null) bVal = sortOrder === 'asc' ? Infinity : -Infinity;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === 'asc' 
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [bancos, searchTerm, sortKey, sortOrder, segmentoFilter]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const segmentos = useMemo(() => {
    const unique = new Set(bancos.map(b => b.segmento));
    return Array.from(unique).sort();
  }, [bancos]);

  return (
    <section id="bancos" className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
              <Building2 className="h-7 w-7 text-primary" />
              Ranking dos Bancos
            </h2>
            <p className="mt-1 text-muted-foreground">
              {filteredAndSortedBancos.length} instituições encontradas
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome do banco..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-secondary pl-9"
            />
          </div>

          {/* Segmento Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={segmentoFilter} onValueChange={setSegmentoFilter}>
              <SelectTrigger className="w-32 bg-secondary">
                <SelectValue placeholder="Segmento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {segmentos.map(seg => (
                  <SelectItem key={seg} value={seg}>{seg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger className="w-40 bg-secondary">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instituicao">Nome</SelectItem>
                <SelectItem value="ativoTotal">Ativo Total</SelectItem>
                <SelectItem value="taxaImobilizacao">Taxa Imobilização</SelectItem>
                <SelectItem value="indiceBasileia">Índice Basileia</SelectItem>
                <SelectItem value="roe">ROE</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortOrder}
              className="shrink-0"
            >
              <ArrowUpDown className={`h-4 w-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Grid */}
        {filteredAndSortedBancos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedBancos.map((banco, index) => (
              <BankCard key={banco.codInst || index} banco={banco} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
            <Building2 className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-foreground">Nenhum banco encontrado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente ajustar os filtros de busca
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
