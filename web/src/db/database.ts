import initSqlJs from 'sql.js/dist/sql-wasm-browser.js';
import type { Database, SqlValue } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm-browser.wasm?url';

/** Минимальный интерфейс, совместимый с запросами из front */
export type SqlDatabase = {
  getAllAsync<T>(sql: string, params?: readonly SqlValue[]): Promise<T[]>;
  close: () => void;
};

let sqlModulePromise: ReturnType<typeof initSqlJs> | null = null;

async function getSqlModule() {
  if (!sqlModulePromise) {
    sqlModulePromise = initSqlJs({ locateFile: () => wasmUrl });
  }
  return sqlModulePromise;
}

function rowsFromStatement<T>(stmt: ReturnType<Database['prepare']>): T[] {
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  return rows;
}

function createClient(db: Database): SqlDatabase {
  return {
    getAllAsync<T>(sql: string, params: readonly SqlValue[] = []): Promise<T[]> {
      const stmt = db.prepare(sql);
      try {
        if (params.length > 0) {
          stmt.bind([...params]);
        }
        return Promise.resolve(rowsFromStatement<T>(stmt));
      } finally {
        stmt.free();
      }
    },
    close() {
      db.close();
    },
  };
}

export async function openDatabaseFromFile(file: File): Promise<SqlDatabase> {
  const SQL = await getSqlModule();
  const buffer = await file.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(buffer));
  return createClient(db);
}
