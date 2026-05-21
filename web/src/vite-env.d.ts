/// <reference types="vite/client" />

declare module 'sql.js/dist/sql-wasm-browser.js' {
  import type { InitSqlJsStatic } from 'sql.js';
  const initSqlJs: InitSqlJsStatic;
  export default initSqlJs;
}

interface ImportMetaEnv {
  readonly VITE_MEDIA_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
