import { useQuery } from '@apollo/client';
import { useState } from 'react';

export function useScrollLoading<T>(
  query,
  getItems: (res: any) => T[],
  getVariables: (offset: number) => Record<string, any>
) {
  const [items, setItems] = useState<T[]>([]);
  const [offset, setOffset] = useState<number>(0);

  const { loading } = useQuery(query, {
    variables: getVariables(offset),
    onCompleted: (res) => {
      setItems([...items, ...getItems(res)]);
    },
  });

  const scrollHandler = (e) => {
    if (e.target.scrollTop + e.target.clientHeight === e.target.scrollHeight) {
      setOffset(offset + 50);
    }
  };

  return { scrollHandler, items, loading };
}
