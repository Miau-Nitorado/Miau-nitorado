/**
 * CLIENTE HTTP — API MiauNitorado
 * ------------------------------------------------------------------
 * Camada única de acesso à API ASP.NET Core. Como o back-end serve a
 * SPA pelo wwwroot, em produção front e API ficam na mesma origem e o
 * caminho relativo `/api/v1` já resolve. Em desenvolvimento o proxy do
 * Vite (vite.config.ts) encaminha `/api` para a API local.
 *
 * Responsabilidades:
 *  - anexar o token JWT no header Authorization;
 *  - normalizar os formatos de erro do back-end numa única mensagem;
 *  - limpar a sessão automaticamente em respostas 401.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

const TOKEN_KEY = 'miau_nitorado_token';

/** Erro de API com o status HTTP preservado para quem quiser tratar. */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // silencioso — localStorage pode estar indisponível
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // silencioso
  }
}

/** Formato de erro do GlobalExceptionHandlingMiddleware e do ApiController. */
interface ErrorBody {
  message?: string;
  title?: string;
  errors?: Array<{ property?: string; message?: string }> | Record<string, string[]>;
}

/**
 * Extrai a melhor mensagem possível do corpo de erro. O back-end responde
 * em dois formatos: o do middleware global (`errors` como lista) e o do
 * ApiController com ModelState/ProblemDetails (`errors` como objeto).
 */
function extractErrorMessage(body: ErrorBody | null, status: number): string {
  const validationMessages: string[] = [];

  if (Array.isArray(body?.errors)) {
    for (const item of body.errors) {
      if (item?.message) validationMessages.push(item.message);
    }
  } else if (body?.errors && typeof body.errors === 'object') {
    for (const messages of Object.values(body.errors)) {
      if (Array.isArray(messages)) validationMessages.push(...messages);
    }
  }

  if (validationMessages.length > 0) return validationMessages.join(' ');
  if (body?.message) return body.message;
  if (body?.title) return body.title;

  if (status === 401) return 'Sessão expirada. Entre novamente.';
  if (status === 429) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  if (status >= 500) return 'Erro no servidor. Tente novamente em instantes.';

  return 'Não foi possível concluir a operação.';
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Não foi possível conectar à API. Verifique se o servidor está rodando.', 0);
  }

  if (!response.ok) {
    if (response.status === 401) clearToken();
    const errorBody = (await readBody(response)) as ErrorBody | null;
    throw new ApiError(extractErrorMessage(errorBody, response.status), response.status);
  }

  if (response.status === 204) return undefined as T;

  return (await readBody(response)) as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
