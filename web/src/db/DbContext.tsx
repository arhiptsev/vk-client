import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { SqlDatabase } from './database';
import { openDatabaseFromFile } from './database';
import { getConversations, getMessages } from './queries';
import type { Conversation, Message } from './types';

type DbContextValue = {
  ready: boolean;
  loading: boolean;
  error: string | null;
  fileName: string | null;
  loadFile: (file: File) => Promise<void>;
  reset: () => void;
  getConversations: () => Promise<Conversation[]>;
  getMessages: (
    conversationId: number,
    skip: number,
    limit?: number
  ) => Promise<Message[]>;
};

const DbContext = createContext<DbContextValue | null>(null);

export const DbProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<SqlDatabase | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      db?.close();
    };
  }, [db]);

  const loadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setReady(false);

    setDb((prev) => {
      prev?.close();
      return null;
    });

    try {
      const database = await openDatabaseFromFile(file);
      setDb(database);
      setFileName(file.name);
      setReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось открыть базу');
      setFileName(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    db?.close();
    setDb(null);
    setReady(false);
    setError(null);
    setFileName(null);
  }, [db]);

  const loadConversations = useCallback(async () => {
    if (!db) {
      throw new Error('База данных не загружена');
    }
    return getConversations(db);
  }, [db]);

  const loadMessages = useCallback(
    async (conversationId: number, skip: number, limit?: number) => {
      if (!db) {
        throw new Error('База данных не загружена');
      }
      return getMessages(db, conversationId, skip, limit);
    },
    [db]
  );

  const value = useMemo(
    () => ({
      ready,
      loading,
      error,
      fileName,
      loadFile,
      reset,
      getConversations: loadConversations,
      getMessages: loadMessages,
    }),
    [ready, loading, error, fileName, loadFile, reset, loadConversations, loadMessages]
  );

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
};

export const useDb = (): DbContextValue => {
  const ctx = useContext(DbContext);
  if (!ctx) {
    throw new Error('useDb должен использоваться внутри DbProvider');
  }
  return ctx;
};
