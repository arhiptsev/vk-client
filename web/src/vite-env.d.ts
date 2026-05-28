/// <reference types="vite/client" />

declare module 'sql.js/dist/sql-wasm-browser.js' {
  import type { InitSqlJsStatic } from 'sql.js';
  const initSqlJs: InitSqlJsStatic;
  export default initSqlJs;
}

declare module '*.wasm?inline-wasm' {
  const base64: string;
  export default base64;
}

interface ImportMetaEnv {
  readonly VITE_MEDIA_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
