/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base da API. Vazio em dev/prod — o front usa /api/v1 na mesma origem. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
