/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other env variables here if you have them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}