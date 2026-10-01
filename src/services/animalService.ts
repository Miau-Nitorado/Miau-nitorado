import type { AnimalOccurrence, AnimalFormData } from '@/types';
import { demoOccurrences } from '@/data/demoData';
import { generateId } from '@/utils';

/**
 * CAMADA DE SERVIÇOS — ANIMAIS / OCORRÊNCIAS
 * ------------------------------------------------------------------
 * Centraliza todas as operações de dados relacionadas a ocorrências.
 * Atualmente utiliza localStorage como persistência local combinando
 * com os dados de demonstração.
 *
 * 🔗 PONTO DE INTEGRAÇÃO FUTURA:
 * Substitua as implementações abaixo por chamadas a uma API REST/GraphQL.
 * Exemplo:
 *   const response = await fetch('/api/occurrences');
 *   return response.json();
 */

const STORAGE_KEY = 'miau_nitorado_occurrences';
const INIT_KEY = 'miau_nitorado_initialized';

function loadFromStorage(): AnimalOccurrence[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnimalOccurrence[];
  } catch {
    return [];
  }
}

function saveToStorage(items: AnimalOccurrence[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // silencioso — localStorage pode estar indisponível
  }
}

/**
 * Garante que os dados de demonstração sejam carregados apenas uma vez.
 */
function ensureInitialized(): void {
  const done = localStorage.getItem(INIT_KEY);
  if (!done) {
    saveToStorage(demoOccurrences);
    localStorage.setItem(INIT_KEY, '1');
  }
}

function getAllOccurrences(): AnimalOccurrence[] {
  ensureInitialized();
  return loadFromStorage();
}

export async function getOccurrences(): Promise<AnimalOccurrence[]> {
  // 🔗 FUTURO: const res = await fetch('/api/occurrences'); return res.json();
  return getAllOccurrences();
}

export async function getOccurrenceById(id: string): Promise<AnimalOccurrence | null> {
  // 🔗 FUTURO: const res = await fetch(`/api/occurrences/${id}`); ...
  const items = getAllOccurrences();
  return items.find((o) => o.id === id) ?? null;
}

export async function getOccurrencesByType(type: 'perdido' | 'encontrado'): Promise<AnimalOccurrence[]> {
  const items = getAllOccurrences();
  return items.filter((o) => o.type === type);
}

export async function getOccurrencesByUser(userId: string): Promise<AnimalOccurrence[]> {
  const items = getAllOccurrences();
  return items.filter((o) => o.userId === userId);
}

export async function createOccurrence(
  data: AnimalFormData,
  userId: string
): Promise<AnimalOccurrence> {
  // 🔗 FUTURO: const res = await fetch('/api/occurrences', { method: 'POST', body: ... });
  const items = getAllOccurrences();
  const now = new Date().toISOString();
  const animalId = generateId();
  const occId = generateId();

  const occurrence: AnimalOccurrence = {
    id: occId,
    animalId,
    animal: {
      id: animalId,
      name: data.name || 'Sem identificação',
      species: data.species as AnimalOccurrence['animal']['species'],
      breed: data.breed || 'Não informada',
      sex: data.sex as AnimalOccurrence['animal']['sex'],
      age: data.age || 'Não informada',
      size: data.size as AnimalOccurrence['animal']['size'],
      color: data.color,
      characteristics: data.characteristics,
      particularCharacteristics: data.particularCharacteristics,
      photos: data.photos.length > 0 ? data.photos : [{
        id: generateId(),
        url: '',
        alt: 'Sem foto',
      }],
      hasCollar: data.hasCollar,
      collarDescription: data.collarDescription,
      hasMicrochip: data.hasMicrochip,
    },
    type: data.type,
    status: data.type === 'perdido' ? 'perdido' : 'encontrado',
    date: data.date,
    time: data.time,
    location: {
      city: data.city,
      neighborhood: data.neighborhood,
      reference: data.reference,
    },
    description: data.description,
    additionalInfo: data.additionalInfo,
    contact: {
      name: data.contactName,
      phone: data.contactPhone,
      email: data.contactEmail || undefined,
      preferredMethod: data.contactMethod,
    },
    userId,
    createdAt: now,
    updatedAt: now,
  };

  items.unshift(occurrence);
  saveToStorage(items);
  return occurrence;
}

export async function updateOccurrence(
  id: string,
  data: Partial<AnimalFormData>,
  userId: string
): Promise<AnimalOccurrence | null> {
  // 🔗 FUTURO: const res = await fetch(`/api/occurrences/${id}`, { method: 'PUT', ... });
  const items = getAllOccurrences();
  const idx = items.findIndex((o) => o.id === id && o.userId === userId);
  if (idx === -1) return null;

  const current = items[idx];
  const updated: AnimalOccurrence = {
    ...current,
    animal: {
      ...current.animal,
      name: data.name ?? current.animal.name,
      species: (data.species as AnimalOccurrence['animal']['species']) ?? current.animal.species,
      breed: data.breed ?? current.animal.breed,
      sex: (data.sex as AnimalOccurrence['animal']['sex']) ?? current.animal.sex,
      age: data.age ?? current.animal.age,
      size: (data.size as AnimalOccurrence['animal']['size']) ?? current.animal.size,
      color: data.color ?? current.animal.color,
      characteristics: data.characteristics ?? current.animal.characteristics,
      particularCharacteristics: data.particularCharacteristics ?? current.animal.particularCharacteristics,
      photos: data.photos ?? current.animal.photos,
      hasCollar: data.hasCollar ?? current.animal.hasCollar,
      collarDescription: data.collarDescription ?? current.animal.collarDescription,
      hasMicrochip: data.hasMicrochip ?? current.animal.hasMicrochip,
    },
    date: data.date ?? current.date,
    time: data.time ?? current.time,
    location: {
      ...current.location,
      city: data.city ?? current.location.city,
      neighborhood: data.neighborhood ?? current.location.neighborhood,
      reference: data.reference ?? current.location.reference,
    },
    description: data.description ?? current.description,
    additionalInfo: data.additionalInfo ?? current.additionalInfo,
    contact: {
      ...current.contact,
      name: data.contactName ?? current.contact.name,
      phone: data.contactPhone ?? current.contact.phone,
      email: data.contactEmail ?? current.contact.email,
      preferredMethod: data.contactMethod ?? current.contact.preferredMethod,
    },
    updatedAt: new Date().toISOString(),
  };

  items[idx] = updated;
  saveToStorage(items);
  return updated;
}

export async function updateOccurrenceStatus(
  id: string,
  status: AnimalOccurrence['status'],
  userId: string
): Promise<AnimalOccurrence | null> {
  // 🔗 FUTURO: const res = await fetch(`/api/occurrences/${id}/status`, { method: 'PATCH', ... });
  const items = getAllOccurrences();
  const idx = items.findIndex((o) => o.id === id && o.userId === userId);
  if (idx === -1) return null;
  items[idx].status = status;
  items[idx].updatedAt = new Date().toISOString();
  saveToStorage(items);
  return items[idx];
}

export async function deleteOccurrence(id: string, userId: string): Promise<boolean> {
  // 🔗 FUTURO: const res = await fetch(`/api/occurrences/${id}`, { method: 'DELETE' });
  const items = getAllOccurrences();
  const filtered = items.filter((o) => !(o.id === id && o.userId === userId));
  if (filtered.length === items.length) return false;
  saveToStorage(filtered);
  return true;
}

export async function getRecentOccurrences(limit = 6): Promise<AnimalOccurrence[]> {
  const items = getAllOccurrences();
  return [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/** Retorna lista única de cidades das ocorrências */
export async function getAvailableCities(): Promise<string[]> {
  const items = getAllOccurrences();
  const cities = [...new Set(items.map((o) => o.location.city))];
  return cities.sort();
}
