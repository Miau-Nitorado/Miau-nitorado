import { MapPin, Info } from 'lucide-react';
import type { Location } from '@/types';

interface LocationCardProps {
  location: Location;
  date: string;
  time?: string;
}

/**
 * Card de localização com mapa simulado.
 * 🔗 PONTO DE INTEGRAÇÃO FUTURA: Substituir o mapa simulado por uma
 *    integração real com uma API de mapas (ex: Leaflet + OpenStreetMap,
 *    Google Maps, Mapbox). Os campos latitude/longitude já estão
 *    preparados no tipo Location.
 */
export default function LocationCard({ location, date, time }: LocationCardProps) {
  return (
    <div className="card overflow-hidden">
      {/* Mapa simulado */}
      <div className="relative h-48 bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center">
        {/* Grid pattern simulando mapa */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, #94a3b8 1px, transparent 1px),
              linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Pin central */}
        <div className="relative flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg animate-pulse">
            <MapPin size={24} />
          </div>
          <div className="mt-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow">
            Localização aproximada
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <MapPin size={18} className="text-teal-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-gray-900">{location.city}</p>
            <p className="text-sm text-gray-500">{location.neighborhood}</p>
            {location.reference && (
              <p className="text-sm text-gray-500 mt-0.5">{location.reference}</p>
            )}
          </div>
        </div>

        {date && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold">Data:</span> {date}
            {time && <span>às {time}</span>}
          </div>
        )}

        <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">
          <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-800">
            Por segurança, a localização é aproximada. Não é necessário divulgar
            seu endereço residencial exato.
          </p>
        </div>
      </div>
    </div>
  );
}
