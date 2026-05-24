import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  MESSAGE_PAGE_SIZE_OPTIONS,
  MESSAGES_PAGE_SIZE,
  type MessagePageSize,
} from '../common/constants';
import { messageIdentityAttributes } from '../common/messageIdentity';
import { Attachments } from '../components/attachments/Attachments';
import { QuotedMessageView } from '../components/QuotedMessage';
import { VirtualList, type VirtualListHandle } from '../components/VirtualList';
import { useDb } from '../db/DbContext';
import type { Message } from '../db/types';

const PREPEND_COOLDOWN_MS = 800;
const SCROLL_LOAD_REARM_PX = 240;

const PAGE_SIZE_LABELS: Record<MessagePageSize, string> = {
  100: '100',
  1000: '1K',
  10000: '10K',
};

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

const MessageBubble = memo(({ message }: { message: Message }) => {
  const incoming = !!message.out;
  const isReceived = !message.out;
  const senderName = isReceived ? formatSenderName(message.Sender) : null;

  const identityProps = messageIdentityAttributes(message);

  return (
    <div className={`message-row${incoming ? ' incoming' : ''}`} {...identityProps}>
      <div className={`bubble ${incoming ? 'incoming' : 'outgoing'}`}>
        {senderName && <div className="message-sender">{senderName}</div>}
        {message.QuotedMessages.map((quoted) => (
          <QuotedMessageView key={quoted.export_id} quoted={quoted} />
        ))}
        {!!message.text && <p className="message-text">{message.text}</p>}
        {message.Attachment.length > 0 && (
          <Attachments attachments={message.Attachment} />
        )}
        <div className="message-date">{formatDate(message.date)}</div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export const DialogPage = () => {
  const { id } = useParams();
  const conversationId = Number(id);
  const { getMessages } = useDb();
  const listRef = useRef<VirtualListHandle>(null);

  const prependReadyRef = useRef(false);
  const canLoadOlderRef = useRef(true);
  const prependLockRef = useRef(false);
  const mustLeaveTopRef = useRef(false);
  const skipRef = useRef(0);
  const pageSizeRef = useRef(MESSAGES_PAGE_SIZE);
  const fetchedSkipsRef = useRef(new Set<number>());
  const ignoreScrollUntilRef = useRef(0);
  const scrollSnapshotRef = useRef<{ top: number; height: number } | null>(null);
  const guardsRef = useRef({ loading: false, loadingMore: false, hasMore: true });

  const [items, setItems] = useState<Message[]>([]);
  console.log('items.length', items.length);
  const [pageSize, setPageSize] = useState<MessagePageSize>(MESSAGES_PAGE_SIZE);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  skipRef.current = skip;
  pageSizeRef.current = pageSize;
  guardsRef.current = { loading, loadingMore, hasMore };

  const loadPage = useCallback(
    async (nextSkip: number, append: boolean): Promise<number> => {
      const isInitial = nextSkip === 0 && !append;
      if (isInitial) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const limit = pageSizeRef.current;
        const newItems = await getMessages(conversationId, nextSkip, limit);
        const chronological = [...newItems].reverse();
        const pageFull = newItems.length === limit;

        if (append) {
          setItems((prev) => [...chronological, ...prev]);
          setSkip(nextSkip);
          setHasMore(pageFull);
          return chronological.length;
        }

        setItems(chronological);
        setSkip(0);
        setHasMore(pageFull);
        return 0;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки сообщений');
        return 0;
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [conversationId, getMessages]
  );

  useEffect(() => {
    prependReadyRef.current = false;
    canLoadOlderRef.current = true;
    prependLockRef.current = false;
    mustLeaveTopRef.current = false;
    fetchedSkipsRef.current.clear();
    scrollSnapshotRef.current = null;
    ignoreScrollUntilRef.current = 0;
    setItems([]);
    setSkip(0);
    setHasMore(true);
    void loadPage(0, false);
  }, [conversationId, pageSize, loadPage]);

  useEffect(() => {
    prependReadyRef.current = false;
    canLoadOlderRef.current = true;
    if (loading || items.length === 0) return;

    const timerId = window.setTimeout(() => {
      prependReadyRef.current = true;
    }, 400);

    return () => window.clearTimeout(timerId);
  }, [conversationId, loading, items.length]);

  const restoreScrollAfterPrepend = useCallback(() => {
    const snap = scrollSnapshotRef.current;
    scrollSnapshotRef.current = null;
    const scroller = listRef.current?.getScrollerElement();
    if (!snap || !scroller) return;

    let attempts = 0;
    const restore = () => {
      const added = scroller.scrollHeight - snap.height;
      if (added <= 0 && attempts < 15) {
        attempts += 1;
        requestAnimationFrame(restore);
        return;
      }
      if (added > 0) {
        scroller.scrollTop = snap.top + added;
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(restore);
    });
  }, []);

  const tryLoadOlder = useCallback(() => {
    const { loading: isLoading, loadingMore: isLoadingMore, hasMore: more } =
      guardsRef.current;

    if (Date.now() < ignoreScrollUntilRef.current) return;
    if (prependLockRef.current || mustLeaveTopRef.current) return;
    if (!prependReadyRef.current || isLoading || isLoadingMore || !more) return;
    if (!canLoadOlderRef.current) return;

    const nextSkip = skipRef.current + pageSizeRef.current;
    if (fetchedSkipsRef.current.has(nextSkip)) return;

    const scroller = listRef.current?.getScrollerElement();
    if (scroller) {
      scrollSnapshotRef.current = {
        top: scroller.scrollTop,
        height: scroller.scrollHeight,
      };
    }

    fetchedSkipsRef.current.add(nextSkip);
    canLoadOlderRef.current = false;
    mustLeaveTopRef.current = true;
    prependLockRef.current = true;
    ignoreScrollUntilRef.current = Date.now() + PREPEND_COOLDOWN_MS;

    const finishPrepend = () => {
      prependLockRef.current = false;
      ignoreScrollUntilRef.current = Date.now() + PREPEND_COOLDOWN_MS;
    };

    void loadPage(nextSkip, true)
      .then((prependedCount) => {
        if (prependedCount > 0) {
          restoreScrollAfterPrepend();
        }
      })
      .finally(finishPrepend);
  }, [loadPage, restoreScrollAfterPrepend]);

  const handleListScroll = useCallback(() => {
    if (Date.now() < ignoreScrollUntilRef.current) return;

    const scroller = listRef.current?.getScrollerElement();
    if (!scroller) return;

    if (scroller.scrollTop > SCROLL_LOAD_REARM_PX) {
      if (Date.now() >= ignoreScrollUntilRef.current) {
        mustLeaveTopRef.current = false;
        if (!prependLockRef.current) {
          canLoadOlderRef.current = true;
        }
      }
    }
  }, []);

  const scrollToOldest = () => {
    listRef.current?.scrollToTop('smooth');
  };

  const scrollToNewest = () => {
    listRef.current?.scrollToBottom('smooth');
  };

  if (loading && items.length === 0) {
    return <div className="page-scroll centered">Загрузка сообщений…</div>;
  }

  if (error) {
    return (
      <div className="page-scroll centered">
        <p className="error">{error}</p>
      </div>
    );
  }

  const countLabel = hasMore ? `${items.length}+` : String(items.length);

  return (
    <div className="dialog-layout">
      {items.length === 0 ? (
        <div className="messages messages--empty">Нет сообщений</div>
      ) : (
        <VirtualList
          key={conversationId}
          ref={listRef}
          className="messages"
          items={items}
          itemKey={(item) => item.export_id}
          estimateItemHeight={72}
          initialScrollBottom
          reachTopThreshold={120}
          onReachTop={tryLoadOlder}
          onScroll={handleListScroll}
          header={
            loadingMore ? (
              <div className="messages-loader messages-loader--inline">Загрузка…</div>
            ) : null
          }
        >
          {(message) => (
            <div className="virtual-list-item-inner">
              <MessageBubble message={message} />
            </div>
          )}
        </VirtualList>
      )}
      <aside className="dialog-toolbar">
        <button type="button" title="К началу истории" onClick={scrollToOldest}>
          ↑
        </button>
        <span className="count" title={hasMore ? 'Загружено не всё — прокрутите вверх' : undefined}>
          {countLabel}
        </span>
        <div className="dialog-toolbar__page-size" role="group" aria-label="Размер порции при подгрузке">
          {MESSAGE_PAGE_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              type="button"
              className={pageSize === size ? 'is-active' : undefined}
              title={`Подгружать по ${size} сообщений`}
              onClick={() => setPageSize(size)}
            >
              {PAGE_SIZE_LABELS[size]}
            </button>
          ))}
        </div>
        <button type="button" title="К последним сообщениям" onClick={scrollToNewest}>
          ↓
        </button>
      </aside>
    </div>
  );
};
