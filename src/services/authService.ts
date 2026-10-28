import type { AuthUser } from '@/types';
import { api, clearToken, getToken, setToken } from '@/services/apiClient';

/**
 * CAMADA DE SERVIÇOS — AUTENTICAÇÃO (API ASP.NET Core + JWT)
 * ------------------------------------------------------------------
 * Integrado à API MiauNitorado:
 *   login()         → POST /api/v1/login
 *   register()      → POST /api/v1/cadastro
 *   updateProfile() → PUT  /api/v1/usuarios/me
 *   refreshCurrentUser() → GET /api/v1/usuarios/me
 *
 * O token JWT é guardado pelo apiClient. Os dados do usuário ficam em
 * cache no localStorage apenas para o app renderizar já logado no primeiro
 * frame — a fonte de verdade é sempre a API.
 */

const SESSION_KEY = 'miau_nitorado_session';

/** Resposta de /login e /cadastro. */
interface LoginResponse {
  token: string;
  nome: string;
  email: string;
  telefone: string;
  usuarioId: number;
}

/** Resposta de /usuarios/me. */
interface PerfilResponse {
  usuarioId: number;
  nome: string;
  email: string;
  telefone: string;
  dataCriacao: string;
}

function toAuthUser(data: LoginResponse | PerfilResponse): AuthUser {
  return {
    id: String(data.usuarioId),
    name: data.nome,
    email: data.email,
    phone: data.telefone,
  };
}

function cacheSession(user: AuthUser): AuthUser {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // silencioso — localStorage pode estar indisponível
  }
  return user;
}

function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // silencioso
  }
  clearToken();
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await api.post<LoginResponse>('/login', { email, senha: password });
  setToken(data.token);
  return cacheSession(toAuthUser(data));
}

export async function register(
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<AuthUser> {
  const data = await api.post<LoginResponse>('/cadastro', {
    nome: name,
    email,
    telefone: phone,
    senha: password,
  });
  setToken(data.token);
  return cacheSession(toAuthUser(data));
}

/**
 * Sessão em cache — síncrona, usada no estado inicial do AuthProvider.
 * Só considera o usuário logado se o token ainda estiver presente.
 */
export function getCurrentUser(): AuthUser | null {
  if (!getToken()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Revalida a sessão contra a API. Retorna null quando o token expirou
 * ou foi revogado — nesse caso a sessão local também é descartada.
 */
export async function refreshCurrentUser(): Promise<AuthUser | null> {
  if (!getToken()) return null;
  try {
    const data = await api.get<PerfilResponse>('/usuarios/me');
    return cacheSession(toAuthUser(data));
  } catch {
    clearSession();
    return null;
  }
}

export function logout(): void {
  clearSession();
}

export async function updateProfile(
  _userId: string,
  updates: Partial<Pick<AuthUser, 'name' | 'phone'>>
): Promise<AuthUser> {
  // A API identifica o usuário pelo token, por isso o id não é enviado.
  void _userId;

  const atual = getCurrentUser();

  const data = await api.put<PerfilResponse>('/usuarios/me', {
    nome: updates.name ?? atual?.name ?? '',
    telefone: updates.phone ?? atual?.phone ?? '',
  });

  return cacheSession(toAuthUser(data));
}
