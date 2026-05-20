import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { SQLiteDatabase } from 'expo-sqlite';

import { initDatabase } from './database';
import { getConversations, getMessages } from './queries';
import type { Conversation, Message } from './types';

type DbContextValue = {
  ready: boolean;
  error: string | null;
  getConversations: () => Promise<Conversation[]>;
  getMessages: (conversationId: number, skip: number) => Promise<Message[]>;
};

const DbContext = createContext<DbContextValue | null>(null);

export const DbProvider = ({ children }: { children: React.ReactNode }) => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    initDatabase()
      .then((database) => {
        if (!cancelled) {
          setDb(database);
          setReady(true);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadConversations = useCallback(async () => {
    if (!db) {
      throw new Error('База данных не готова');
    }
    return getConversations(db);
  }, [db]);

  const loadMessages = useCallback(
    async (conversationId: number, skip: number) => {
      if (!db) {
        throw new Error('База данных не готова');
      }
      return getMessages(db, conversationId, skip);
    },
    [db]
  );

  const value = useMemo(
    () => ({
      ready,
      error,
      getConversations: loadConversations,
      getMessages: loadMessages,
    }),
    [ready, error, loadConversations, loadMessages]
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
