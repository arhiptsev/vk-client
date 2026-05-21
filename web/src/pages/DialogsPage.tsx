import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useDb } from '../db/DbContext';
import type { Conversation } from '../db/types';

export const DialogsPage = () => {
  const { getConversations } = useDb();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить диалоги');
    } finally {
      setLoading(false);
    }
  }, [getConversations]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <div className="page-scroll centered">Загрузка диалогов…</div>;
  }

  if (error) {
    return (
      <div className="page-scroll centered">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-scroll">
    <ul className="list">
      {conversations.map((item) => {
        const { first_name, last_name } = item.Peer.UserInfo;
        const name = [first_name, last_name].filter(Boolean).join(' ') || 'Без имени';

        return (
          <li key={item.export_id}>
            <Link className="list-item" to={`/dialog/${item.export_id}`}>
              <div className="name">{name}</div>
              <div className="meta">
                ID {item.export_id} · {item._count.Message} сообщений
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
    </div>
  );
};
