import type { AnimalOccurrence } from '@/types';
import AnimalCard from './AnimalCard';

interface AnimalGridProps {
  occurrences: AnimalOccurrence[];
}

export default function AnimalGrid({ occurrences }: AnimalGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {occurrences.map((occ) => (
        <AnimalCard key={occ.id} occurrence={occ} />
      ))}
    </div>
  );
}
