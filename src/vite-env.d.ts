/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin only, e.g. http://localhost:8080 - the client appends /api/v1. */
  readonly VITE_API_URL?: string;
  /** "true" to show the order chat entry points. Off until the backend ships chat. */
  readonly VITE_FEATURE_CHAT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}