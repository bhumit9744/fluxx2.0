/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_LLM_API_KEY: string;
  readonly VITE_FASTAPI_WS_URL: string;
  readonly VITE_FASTAPI_REST_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css';
