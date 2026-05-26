import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { MESSAGE_SEARCH_MIN_LENGTH } from '../common/constants';
import { searchLoadedMessages } from '../search/searchLoadedMessages';
import type { Message, MessageSearchHit } from '../db/types';

const formatSenderName = (sender: MessageSearchHit['Sender']) => {
  if (!sender) return null;
  const name = [sender.first_name, sender.last_name].filter(Boolean).join(' ');
  return name || null;
};

const formatDate = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const snippet = (text: string, max = 120) => {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
};

type Props = {
  items: Message[];
  hasMore: boolean;
  onSelect: (hit: MessageSearchHit) => void;
};

export const DialogMessageSearch = ({ items, hasMore, onSelect }: Props) => {
  const listId = useId();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current != null) {
      window.clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < MESSAGE_SEARCH_MIN_LENGTH) {
      setDebouncedQuery('');
      setOpen(false);
      return;
    }

    debounceRef.current = window.setTimeout(() => {
      setDebouncedQuery(trimmed);
      setOpen(true);
    }, 200);

    return () => {
      if (debounceRef.current != null) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const results = useMemo(
    () => searchLoadedMessages(items, debouncedQuery),
    [items, debouncedQuery]
  );

  const showDropdown = open && debouncedQuery.length >= MESSAGE_SEARCH_MIN_LENGTH;

  return (
    <div className="dialog-search">
      <input
        type="search"
        className="dialog-search__input"
        placeholder="Поиск в загруженных сообщениях…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (query.trim().length >= MESSAGE_SEARCH_MIN_LENGTH) {
            setOpen(true);
          }
        }}
        aria-controls={listId}
        aria-expanded={showDropdown}
        autoComplete="off"
      />
      {showDropdown && (
        <div id={listId} className="dialog-search__results" role="listbox">
          {results.length === 0 && (
            <div className="dialog-search__status">Ничего не найдено в загруженных</div>
          )}
          {hasMore && results.length > 0 && (
            <div className="dialog-search__status dialog-search__status--hint">
              Ищем только среди загруженных. Прокрутите вверх, чтобы подгрузить старые.
            </div>
          )}
          {results.map((hit) => {
            const sender = formatSenderName(hit.Sender);
            const isNested = hit.export_id !== hit.anchor_export_id;
            return (
              <button
                key={hit.export_id}
                type="button"
                className="dialog-search__hit"
                role="option"
                onClick={() => {
                  onSelect(hit);
                  setOpen(false);
                }}
              >
                <span className="dialog-search__hit-meta">
                  {sender && <span className="dialog-search__hit-author">{sender}</span>}
                  {isNested && <span className="dialog-search__hit-tag">цитата</span>}
                  <span className="dialog-search__hit-date">{formatDate(hit.date)}</span>
                </span>
                <span className="dialog-search__hit-text">{snippet(hit.text)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
