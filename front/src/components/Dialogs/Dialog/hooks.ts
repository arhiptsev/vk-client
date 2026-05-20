import { useCallback, useEffect, useState } from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { useDb } from '../../../db/DbContext';
import type { Message } from '../../../db/types';

export type { Message };

export function useScrollLoading(conversationId: number) {
  const { getMessages } = useDb();
  const [items, setItems] = useState<Message[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (nextSkip: number, append: boolean) => {
      const isInitial = nextSkip === 0 && !append;
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const newItems = await getMessages(conversationId, nextSkip);
        setItems((prev) => (append ? [...prev, ...newItems] : newItems));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки сообщений');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [conversationId, getMessages]
  );

  useEffect(() => {
    setItems([]);
    setSkip(0);
    loadPage(0, false);
  }, [conversationId, loadPage]);

  useEffect(() => {
    if (skip > 0) {
      loadPage(skip, true);
    }
  }, [skip, loadPage]);

  const scrollHandler = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const nearTop = contentOffset.y < 50;
    const canLoadMore =
      contentSize.height > layoutMeasurement.height && !loading && !loadingMore;

    if (nearTop && canLoadMore) {
      setSkip((prev) => prev + 100);
    }
  };

  return {
    scrollHandler,
    items,
    loading: loading && items.length === 0,
    loadingMore,
    error,
  };
}
