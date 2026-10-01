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

  const update = (key: keyof AnimalFiltersType, value: string) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  const clearAll = () => {
    onChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v);

  const filtersContent = (
    <div className="flex flex-col gap-4">
      <Select
        label="Espécie"
        value={filters.species || ''}
        onChange={(e) => update('species', e.target.value)}
        placeholder="Todas as espécies"
        options={speciesOptions}
      />
      <Input
        label="Raça"
        value={filters.breed || ''}
        onChange={(e) => update('breed', e.target.value)}
        placeholder="Ex: Pastor Alemão"
      />
      <Select
        label="Sexo"
        value={filters.sex || ''}
        onChange={(e) => update('sex', e.target.value)}
        placeholder="Todos"
        options={sexOptions}
      />
      <Select
        label="Porte"
        value={filters.size || ''}
        onChange={(e) => update('size', e.target.value)}
        placeholder="Todos os portes"
        options={sizeOptions}
      />
      <Select
        label="Cidade"
        value={filters.city || ''}
        onChange={(e) => update('city', e.target.value)}
        placeholder="Todas as cidades"
        options={cities.map((c) => ({ value: c, label: c }))}
      />
      <Input
        label="Bairro"
        value={filters.neighborhood || ''}
        onChange={(e) => update('neighborhood', e.target.value)}
        placeholder="Ex: Centro"
      />
      <Select
        label="Status"
        value={filters.status || ''}
        onChange={(e) => update('status', e.target.value)}
        placeholder="Todos os status"
        options={statusOptions}
      />

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          <X size={16} /> Limpar filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 card p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-teal-600" />
            Filtros
          </h3>
          {filtersContent}
        </div>
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-secondary w-full"
        >
          <SlidersHorizontal size={18} />
          Filtros {hasActiveFilters && <span className="ml-1 rounded-full bg-teal-600 text-white text-xs px-2 py-0.5">Ativos</span>}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40 animate-fade-in" />
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto animate-slide-in p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Filtros</h3>
              <button onClick={() => setMobileOpen(false)} aria-label="Fechar filtros">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            {filtersContent}
            <button
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full mt-4"
            >
              Ver resultados
            </button>
          </div>
        </div>
      )}
    </>
  );
}


