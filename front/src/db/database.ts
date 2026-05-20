import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'vkclient.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

async function ensureDatabaseFile(): Promise<void> {
  const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${sqliteDir}/${DB_NAME}`;

  const existing = await FileSystem.getInfoAsync(dbPath);
  if (existing.exists) {
    return;
  }

  await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const asset = Asset.fromModule(require('../../assets/sqlite.db'));
    await asset.downloadAsync();
    if (!asset.localUri) {
      throw new Error('Не удалось загрузить sqlite.db из assets');
    }
    await FileSystem.copyAsync({ from: asset.localUri, to: dbPath });
  } catch {
    throw new Error(
      'База sqlite.db не найдена. Выполните в папке front: npm run db:prepare'
    );
  }
}

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  await ensureDatabaseFile();
  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  return dbInstance;
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    throw new Error('База данных ещё не инициализирована');
  }
  return dbInstance;
}
