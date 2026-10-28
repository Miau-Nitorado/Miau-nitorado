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

/**
 * Valida a senha com as mesmas regras do back-end
 * (MiauNitorado.Application/Validador/UsuariosValidadores/CadastroUsuarioValidator.cs).
 * Retorna a mensagem do primeiro problema encontrado, ou null se estiver ok.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'A senha deve ter no mínimo 8 caracteres.';
  if (password.length > 128) return 'A senha deve ter no máximo 128 caracteres.';
  if (!/[A-Z]/.test(password)) return 'A senha deve conter ao menos uma letra maiúscula.';
  if (!/[a-z]/.test(password)) return 'A senha deve conter ao menos uma letra minúscula.';
  if (!/[0-9]/.test(password)) return 'A senha deve conter ao menos um número.';
  if (!/[!@#$%^&*]/.test(password)) {
    return 'A senha deve conter ao menos um caractere especial (!@#$%^&*).';
  }
  return null;
}

/**
 * Valida o telefone pela quantidade de dígitos (10 com DDD fixo, 11 com celular),
 * aceitando máscara — espelha a regra do back-end.
 */
export function validatePhone(phone: string): string | null {
  const digitos = phone.replace(/\D/g, '').length;
  if (digitos !== 10 && digitos !== 11) {
    return 'Informe o telefone com DDD (10 ou 11 dígitos).';
  }
  return null;
}
