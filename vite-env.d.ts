/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Server base URL. `/api` in production (proxied by vercel.json). */
  readonly VITE_API_URL: string;
  readonly VITE_MSAL_CLIENT_ID?: string;
  readonly VITE_MSAL_AUTHORITY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
