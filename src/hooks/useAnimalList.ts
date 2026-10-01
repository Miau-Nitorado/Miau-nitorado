import { useState, useMemo, useEffect, useCallback } from 'react';
import type { AnimalOccurrence, AnimalFilters as AnimalFiltersType } from '@/types';
import * as animalService from '@/services/animalService';
import { matchesSearch } from '@/utils';

type SortOption = 'recentes' | 'antigos' | 'proximidade';

interface UseAnimalListOptions {
  type?: 'perdido' | 'encontrado';
}

interface UseAnimalListReturn {
  occurrences: AnimalOccurrence[];
  filtered: AnimalOccurrence[];
  loading: boolean;
  search: string;
  setSearch: (v: string) => void;
  filters: AnimalFiltersType;
  setFilters: (f: AnimalFiltersType) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  cities: string[];
  refresh: () => void;
}

export function useAnimalList({ type }: UseAnimalListOptions = {}): UseAnimalListReturn {
  const [occurrences, setOccurrences] = useState<AnimalOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<AnimalFiltersType>({});
  const [sort, setSort] = useState<SortOption>('recentes');
  const [cities, setCities] = useState<string[]>([]);

  const load = useCallback(() => {
    setLoading(true);
    animalService.getOccurrences().then((all) => {
      const filtered = type ? all.filter((o) => o.type === type) : all;
      setOccurrences(filtered);
      animalService.getAvailableCities().then(setCities);
      setLoading(false);
    });
  }, [type]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let result = occurrences.filter((o) => matchesSearch(search, o));

    if (filters.species) result = result.filter((o) => o.animal.species === filters.species);
    if (filters.breed) result = result.filter((o) => o.animal.breed.toLowerCase().includes(filters.breed!.toLowerCase()));
    if (filters.sex) result = result.filter((o) => o.animal.sex === filters.sex);
    if (filters.size) result = result.filter((o) => o.animal.size === filters.size);
    if (filters.city) result = result.filter((o) => o.location.city === filters.city);
    if (filters.neighborhood) result = result.filter((o) => o.location.neighborhood.toLowerCase().includes(filters.neighborhood!.toLowerCase()));
    if (filters.status) result = result.filter((o) => o.status === filters.status);
    if (filters.dateFrom) result = result.filter((o) => o.date >= filters.dateFrom!);
    if (filters.dateTo) result = result.filter((o) => o.date <= filters.dateTo!);

    // Sort
    result = [...result];
    if (sort === 'recentes') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'antigos') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    // 'proximidade' — preparado para futura integração com geolocalização.
    // Por enquanto, ordena por cidade para simular agrupamento por proximidade.
    if (sort === 'proximidade') {
      result.sort((a, b) => a.location.city.localeCompare(b.location.city));
    }

    return result;
  }, [occurrences, search, filters, sort]);

  return {
    occurrences,
    filtered,
    loading,
    search,
    setSearch,
    filters,
    setFilters,
    sort,
    setSort,
    cities,
    refresh: load,
  };
}
