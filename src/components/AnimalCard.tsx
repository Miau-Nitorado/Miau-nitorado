import { Link } from 'react-router-dom';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import type { AnimalOccurrence } from '@/types';
import { formatDate } from '@/utils';
import StatusBadge from './ui/StatusBadge';

interface AnimalCardProps {
  occurrence: AnimalOccurrence;
}

export default function AnimalCard({ occurrence }: AnimalCardProps) {
  const { animal, location, date, status } = occurrence;
  const photo = animal.photos[0];

  return (
    <Link
      to={`/animal/${occurrence.id}`}
      className="card group overflow-hidden transition-all hover:shadow-md hover:border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
    >
      {/* Status badge sobre a foto */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {photo?.url ? (
          <img
            src={photo.url}
            alt={photo.alt || `Foto de ${animal.name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <span className="text-sm">Sem foto</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={status} size="md" />
        </div>
      </div>

      {/* Informações */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-base font-bold text-gray-900 truncate">
          {animal.name}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {animal.species} • {animal.breed}
        </p>

        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin size={14} className="text-teal-600 shrink-0" />
          <span className="truncate">{location.city} / {location.neighborhood}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Calendar size={14} className="text-teal-600 shrink-0" />
          <span>{formatDate(date)}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
          <span className="text-sm font-semibold text-teal-600 group-hover:text-teal-700 transition-colors">
            Ver detalhes
          </span>
          <ChevronRight size={18} className="text-teal-600 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
