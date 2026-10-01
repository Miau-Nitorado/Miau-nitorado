export type AnimalStatus = 'perdido' | 'encontrado' | 'localizado' | 'encerrado';

export type AnimalType = 'perdido' | 'encontrado';

export type Species = 'Cachorro' | 'Gato' | 'Pássaro' | 'Coelho' | 'Outro';

export type Sex = 'Macho' | 'Fêmea' | 'Desconhecido';

export type Size = 'Pequeno' | 'Médio' | 'Grande';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  url: string;
  alt: string;
}

export interface Location {
  city: string;
  neighborhood: string;
  /** Latitude para futura integração com mapas */
  latitude?: number;
  /** Longitude para futura integração com mapas */
  longitude?: number;
  reference?: string;
}

export interface Contact {
  name: string;
  phone: string;
  email?: string;
  preferredMethod: 'telefone' | 'email' | 'whatsapp';
}

export interface Animal {
  id: string;
  name: string;
  species: Species;
  breed: string;
  sex: Sex;
  age: string;
  size: Size;
  color: string;
  characteristics: string;
  particularCharacteristics: string;
  photos: Photo[];
  hasCollar: boolean;
  collarDescription?: string;
  hasMicrochip: boolean;
}

export interface AnimalOccurrence {
  id: string;
  animalId: string;
  animal: Animal;
  type: AnimalType;
  status: AnimalStatus;
  date: string;
  time: string;
  location: Location;
  description: string;
  additionalInfo?: string;
  contact: Contact;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnimalFilters {
  species?: Species | '';
  breed?: string;
  sex?: Sex | '';
  size?: Size | '';
  city?: string;
  neighborhood?: string;
  status?: AnimalStatus | '';
  dateFrom?: string;
  dateTo?: string;
}

export type AnimalFormData = {
  // Identificação do animal
  name: string;
  species: Species | '';
  breed: string;
  sex: Sex | '';
  age: string;
  size: Size | '';
  color: string;
  characteristics: string;
  particularCharacteristics: string;
  hasCollar: boolean;
  collarDescription: string;
  hasMicrochip: boolean;
  photos: Photo[];
  // Ocorrência
  type: AnimalType;
  date: string;
  time: string;
  city: string;
  neighborhood: string;
  reference: string;
  description: string;
  additionalInfo: string;
  // Contato
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactMethod: 'telefone' | 'email' | 'whatsapp';
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}
