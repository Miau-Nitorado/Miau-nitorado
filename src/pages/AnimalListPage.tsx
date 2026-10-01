import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PawPrint, SearchX, SlidersHorizontal } from 'lucide-react';
import { useAnimalList } from '@/hooks/useAnimalList';
import AnimalGrid from '@/components/AnimalGrid';
import AnimalSearch from '@/components/AnimalSearch';
import AnimalFilters from '@/components/AnimalFilters';
import EmptyState from '@/components/EmptyState';
import Select from '@/components/ui/Select';

interface AnimalListPageProps {
  type: 'perdido' | 'encontrado';
  title: string;
  subtitle: string;
}

const sortOptions = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'antigos', label: 'Mais antigos' },
  { value: 'proximidade', label: 'Proximidade (preparado)' },
];

export default function AnimalListPage({ type, title, subtitle }: AnimalListPageProps) {
  const { filtered, loading, search, setSearch, filters, setFilters, sort, setSort, cities } = useAnimalList({ type });
  const [params, setParams] = useSearchParams();

  // Sincroniza busca via URL (ex: ?q=thor)
  useEffect(() => {
    const q = params.get('q');
    if (q) setSearch(q);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = (v: string) => {
    setSearch(v);
    if (v.trim()) {
      setParams({ q: v.trim() });
    } else {
      setParams({});
    }
  };

  return (
    <div className="mx-auto max-w-7xl section-padding py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      {/* Busca + ordenação */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <AnimalSearch value={search} onChange={handleSearchChange} />
        </div>
        <div className="sm:w-56">
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            options={sortOptions}
            aria-label="Ordenar por"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filtros */}
        <AnimalFilters filters={filters} onChange={setFilters} cities={cities} />

        {/* Resultados */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {loading ? 'Carregando...' : `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Nenhum animal encontrado com esses critérios"
              message="Tente ajustar os filtros ou o termo de busca para ver mais resultados."
            />
          ) : (
            <AnimalGrid occurrences={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}
