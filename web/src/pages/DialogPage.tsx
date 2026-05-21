import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Attachments } from '../components/attachments/Attachments';
import { QuotedMessageView } from '../components/QuotedMessage';
import { useDb } from '../db/DbContext';
import type { Message } from '../db/types';

const formatSenderName = (sender: Message['Sender']) => {
  if (!sender) return null;
  const name = [sender.first_name, sender.last_name].filter(Boolean).join(' ');
  return name || null;
};

const formatDate = (timestamp?: number | null) => {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MessageBubble = ({ message }: { message: Message }) => {
  const incoming = !!message.out;
  const isReceived = !message.out;
  const senderName = isReceived ? formatSenderName(message.Sender) : null;

  return (
    <div className={`message-row${incoming ? ' incoming' : ''}`}>
      <div className={`bubble ${incoming ? 'incoming' : 'outgoing'}`}>
        {senderName && <div className="message-sender">{senderName}</div>}
        {message.QuotedMessage && <QuotedMessageView quoted={message.QuotedMessage} />}
        {!!message.text && <p className="message-text">{message.text}</p>}
        {message.Attachment.length > 0 && (
          <Attachments attachments={message.Attachment} />
        )}
        <div className="message-date">{formatDate(message.date)}</div>
      </div>
    </div>
  );
};

export const DialogPage = () => {
  const { id } = useParams();
  const conversationId = Number(id);
  const { getMessages } = useDb();
  const listRef = useRef<HTMLDivElement>(null);
  const didScrollToBottom = useRef(false);
  const scrollRestoreRef = useRef<{ scrollTop: number; scrollHeight: number } | null>(
    null
  );

  const [items, setItems] = useState<Message[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (nextSkip: number, append: boolean) => {
      const isInitial = nextSkip === 0 && !append;
      if (isInitial) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const newItems = await getMessages(conversationId, nextSkip);
        // SQL: ORDER BY date DESC — разворачиваем в хронологию (старые → новые)
        const chronological = [...newItems].reverse();

        if (append) {
          const listEl = listRef.current;
          if (listEl) {
            scrollRestoreRef.current = {
              scrollTop: listEl.scrollTop,
              scrollHeight: listEl.scrollHeight,
            };
          }
        }

        setItems((prev) =>
          append ? [...chronological, ...prev] : chronological
        );
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
    didScrollToBottom.current = false;
    scrollRestoreRef.current = null;
    void loadPage(0, false);
  }, [conversationId, loadPage]);

  useEffect(() => {
    if (skip > 0) {
      void loadPage(skip, true);
    }
  }, [skip, loadPage]);

  // После подгрузки старых сообщений — остаёмся на том же месте в ленте
  useLayoutEffect(() => {
    const snapshot = scrollRestoreRef.current;
    if (!snapshot) return;

    const el = listRef.current;
    if (!el) return;

    scrollRestoreRef.current = null;
    el.scrollTop = snapshot.scrollTop + (el.scrollHeight - snapshot.scrollHeight);
  }, [items]);

  // При открытии диалога — прокрутка к последним сообщениям
  useEffect(() => {
    if (loading || items.length === 0 || didScrollToBottom.current) return;
    const el = listRef.current;
    if (!el) return;
    didScrollToBottom.current = true;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [loading, items.length]);

  const onScroll = () => {
    const el = listRef.current;
    if (!el || loading || loadingMore) return;

    const nearTop = el.scrollTop < 50;
    const canLoadMore = el.scrollHeight > el.clientHeight;

    if (nearTop && canLoadMore && !loadingMore) {
      setSkip((prev) => prev + 100);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="page-scroll centered">Загрузка сообщений…</div>
    );
  }

  if (error) {
    return (
      <div className="page-scroll centered">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="dialog-layout">
      <div className="messages" ref={listRef} onScroll={onScroll}>
        {loadingMore && <div className="messages-loader">Загрузка…</div>}
        {items.map((item) => (
          <MessageBubble key={item.export_id} message={item} />
        ))}
      </div>
      <aside className="dialog-toolbar">
        <button
          type="button"
          title="К началу истории"
          onClick={() => listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
        <span className="count">{items.length}</span>
        <button
          type="button"
          title="К последним сообщениям"
          onClick={() =>
            listRef.current?.scrollTo({
              top: listRef.current.scrollHeight,
              behavior: 'smooth',
            })
          }
        >
          ↓
        </button>
      </aside>
    </div>
  );
};
