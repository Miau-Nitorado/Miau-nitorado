import type { AuthUser } from '@/types';

/**
 * CAMADA DE SERVIÇOS — AUTENTICAÇÃO (SIMULADA)
 * ------------------------------------------------------------------
 * Esta é uma implementação simulada de autenticação que utiliza
 * localStorage. Não armazena senhas reais — apenas um hash simples
 * para fins de demonstração.
 *
 * ⚠️ Esta camada está claramente separada para que no futuro seja
 *    substituída por uma autenticação real (ex.: Supabase Auth,
 *    Firebase Auth, ou API própria com JWT).
 *
 * 🔗 PONTO DE INTEGRAÇÃO FUTURA:
 *   login()     → POST /api/auth/login (retorna JWT)
 *   register()  → POST /api/auth/register
 *   logout()    → POST /api/auth/logout
 *   profile()   → GET /api/auth/me
 */

const USERS_KEY = 'miau_nitorado_users';
const SESSION_KEY = 'miau_nitorado_session';

interface StoredUser extends AuthUser {
  /** Hash simples — NÃO é seguro para produção. Apenas demonstração. */
  passwordHash: string;
  createdAt: string;
}

/** Hash simples apenas para demonstração local. */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return String(hash);
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toAuthUser(user: StoredUser): AuthUser {
  const { passwordHash, createdAt, ...rest } = user;
  void passwordHash;
  void createdAt;
  return rest;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  // 🔗 FUTURO: const res = await fetch('/api/auth/login', { method: 'POST', body: ... });
  await new Promise((r) => setTimeout(r, 300)); // simula latência de rede

  const users = loadUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error('E-mail não cadastrado.');
  if (user.passwordHash !== simpleHash(password)) throw new Error('Senha incorreta.');

  const authUser = toAuthUser(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
  return authUser;
}

export async function register(name: string, email: string, phone: string, password: string): Promise<AuthUser> {
  // 🔗 FUTURO: const res = await fetch('/api/auth/register', { ... });
  await new Promise((r) => setTimeout(r, 300));

  const users = loadUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Já existe uma conta com este e-mail.');
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone,
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const authUser = toAuthUser(newUser);
  localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
  return authUser;
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function updateProfile(userId: string, updates: Partial<Pick<AuthUser, 'name' | 'phone'>>): Promise<AuthUser> {
  // 🔗 FUTURO: const res = await fetch('/api/auth/me', { method: 'PATCH', ... });
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('Usuário não encontrado.');

  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);

  const authUser = toAuthUser(users[idx]);
  localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
  return authUser;
}
