import { MESSAGE_SEARCH_LIMIT, MESSAGE_SEARCH_MIN_LENGTH } from '../common/constants';
import type { Message, MessageSearchHit, QuotedMessage } from '../db/types';

const textMatches = (text: string, queryLower: string) =>
  text.toLowerCase().includes(queryLower);

function collectQuotedHits(
  quoted: QuotedMessage,
  anchorExportId: number,
  queryLower: string,
  hits: MessageSearchHit[]
): void {
  if (hits.length >= MESSAGE_SEARCH_LIMIT) {
    return;
  }

  if (quoted.text && textMatches(quoted.text, queryLower)) {
    hits.push({
      export_id: quoted.export_id,
      anchor_export_id: anchorExportId,
      text: quoted.text,
      date: quoted.date,
      Sender: quoted.Sender,
    });
  }

  for (const nested of quoted.QuotedMessages) {
    collectQuotedHits(nested, anchorExportId, queryLower, hits);
    if (hits.length >= MESSAGE_SEARCH_LIMIT) {
      return;
    }
  }
}

export function searchLoadedMessages(items: Message[], query: string): MessageSearchHit[] {
  const trimmed = query.trim();
  if (trimmed.length < MESSAGE_SEARCH_MIN_LENGTH) {
    return [];
  }

  const queryLower = trimmed.toLowerCase();
  const hits: MessageSearchHit[] = [];

  for (const message of items) {
    if (message.text && textMatches(message.text, queryLower)) {
      hits.push({
        export_id: message.export_id,
        anchor_export_id: message.export_id,
        text: message.text,
        date: message.date,
        Sender: message.Sender,
      });
    }

    for (const quoted of message.QuotedMessages) {
      collectQuotedHits(quoted, message.export_id, queryLower, hits);
    }

    if (hits.length >= MESSAGE_SEARCH_LIMIT) {
      break;
    }
  }

  return hits.sort((a, b) => b.date - a.date).slice(0, MESSAGE_SEARCH_LIMIT);
}
