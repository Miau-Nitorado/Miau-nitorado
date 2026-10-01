import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import type { Photo } from '@/types';

interface PhotoGalleryProps {
  photos: Photo[];
  alt: string;
}

export default function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <span className="text-sm">Sem foto disponível</span>
      </div>
    );
  }

  const validPhotos = photos.filter((p) => p.url);
  if (validPhotos.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <span className="text-sm">Sem foto disponível</span>
      </div>
    );
  }

  const goPrev = () => setCurrent((c) => (c === 0 ? validPhotos.length - 1 : c - 1));
  const goNext = () => setCurrent((c) => (c === validPhotos.length - 1 ? 0 : c + 1));

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 group">
        <img
          src={validPhotos[current].url}
          alt={validPhotos[current].alt || alt}
          className="w-full aspect-video object-cover"
        />

        {validPhotos.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Próxima foto"
            >
              <ChevronRight size={20} />
            </button>

            {/* Thumbnails */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {validPhotos.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                  aria-label={`Ver foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => setExpanded(true)}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Expandir foto"
        >
          <Expand size={18} />
        </button>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in"
          onClick={() => setExpanded(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-sm font-semibold"
            onClick={() => setExpanded(false)}
          >
            Fechar
          </button>
          <img
            src={validPhotos[current].url}
            alt={validPhotos[current].alt || alt}
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
