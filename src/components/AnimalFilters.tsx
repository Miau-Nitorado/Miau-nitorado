import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import type { AnimalFilters as AnimalFiltersType } from '@/types';
import Select from './ui/Select';
import Input from './ui/Input';

interface AnimalFiltersProps {
  filters: AnimalFiltersType;
  onChange: (filters: AnimalFiltersType) => void;
  cities: string[];
}

const speciesOptions = [
  { value: 'Cachorro', label: 'Cachorro' },
  { value: 'Gato', label: 'Gato' },
  { value: 'Pássaro', label: 'Pássaro' },
  { value: 'Coelho', label: 'Coelho' },
  { value: 'Outro', label: 'Outro' },
];
const sexOptions = [
  { value: 'Macho', label: 'Macho' },
  { value: 'Fêmea', label: 'Fêmea' },
  { value: 'Desconhecido', label: 'Desconhecido' },
];
const sizeOptions = [
  { value: 'Pequeno', label: 'Pequeno' },
  { value: 'Médio', label: 'Médio' },
  { value: 'Grande', label: 'Grande' },
];
const statusOptions = [
  { value: 'perdido', label: 'Perdido' },
  { value: 'encontrado', label: 'Encontrado' },
  { value: 'localizado', label: 'Localizado' },
  { value: 'encerrado', label: 'Encerrado' },
];

export default function AnimalFilters({ filters, onChange, cities }: AnimalFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const update = (key: keyof AnimalFiltersType, value: string) => onChange({ ...filters, [key]: value || undefined });
  const clearAll = () => onChange({});
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const filtersContent = (
    <div className="flex flex-col gap-4">
      <Select label="Espécie" value={filters.species || ''} onChange={e => update('species', e.target.value)} placeholder="Todas as espécies" options={speciesOptions} />
      <Input label="Raça" value={filters.breed || ''} onChange={e => update('breed', e.target.value)} placeholder="Ex: Pastor Alemão" />
      <Select label="Sexo" value={filters.sex || ''} onChange={e => update('sex', e.target.value)} placeholder="Todos" options={sexOptions} />
      <Select label="Porte" value={filters.size || ''} onChange={e => update('size', e.target.value)} placeholder="Todos os portes" options={sizeOptions} />
      <Select label="Cidade" value={filters.city || ''} onChange={e => update('city', e.target.value)} placeholder="Todas as cidades" options={cities.map(c => ({ value: c, label: c }))} />
      <Input label="Bairro" value={filters.neighborhood || ''} onChange={e => update('neighborhood', e.target.value)} placeholder="Ex: Centro" />
      <Select label="Status" value={filters.status || ''} onChange={e => update('status', e.target.value)} placeholder="Todos os status" options={statusOptions} />
      {hasActiveFilters && <button type="button" onClick={clearAll} className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"><X size={16} /> Limpar filtros</button>}
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 card p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><SlidersHorizontal size={16} aria-hidden="true" />Filtros</h2>
          {filtersContent}
        </div>
      </aside>
      <div className="lg:hidden">
        <button type="button" onClick={() => setMobileOpen(true)} aria-expanded={mobileOpen} aria-controls="filtros-mobile" className="btn-secondary w-full">
          <SlidersHorizontal size={18} aria-hidden="true" /> Filtros {hasActiveFilters && <span className="ml-1 rounded-full bg-teal-700 text-white text-xs px-2 py-0.5">Ativos</span>}
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 h-full w-full bg-black/50" aria-label="Fechar filtros" onClick={() => setMobileOpen(false)} />
          <section id="filtros-mobile" role="dialog" aria-modal="true" aria-labelledby="titulo-filtros-mobile" className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="titulo-filtros-mobile" className="text-base font-bold text-gray-900">Filtros</h2>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Fechar filtros"><X size={20} /></button>
            </div>
            {filtersContent}
            <button type="button" onClick={() => setMobileOpen(false)} className="btn-primary mt-4 w-full">Ver resultados</button>
          </section>
        </div>
      )}
    </>
  );
}
