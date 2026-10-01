/**
 * Utilitários de formatação e filtros.
 */

export function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function formatDateTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    perdido: 'Perdido',
    encontrado: 'Encontrado',
    localizado: 'Localizado',
    encerrado: 'Encerrado',
  };
  return map[status] ?? status;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    perdido: 'bg-red-100 text-red-700 border-red-200',
    encontrado: 'bg-amber-100 text-amber-700 border-amber-200',
    localizado: 'bg-green-100 text-green-700 border-green-200',
    encerrado: 'bg-gray-200 text-gray-600 border-gray-300',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '...';
}

/**
 * Verifica se uma ocorrência corresponde a um termo de busca.
 */
export function matchesSearch(
  text: string,
  occurrence: { animal: { name: string; breed: string; species: string; color: string; characteristics: string }; location: { city: string; neighborhood: string } }
): boolean {
  if (!text.trim()) return true;
  const t = text.toLowerCase().trim();
  const fields = [
    occurrence.animal.name,
    occurrence.animal.breed,
    occurrence.animal.species,
    occurrence.animal.color,
    occurrence.animal.characteristics,
    occurrence.location.city,
    occurrence.location.neighborhood,
  ];
  return fields.some((f) => f.toLowerCase().includes(t));
}
