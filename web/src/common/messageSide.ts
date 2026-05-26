import type { Message, QuotedMessage } from '../db/types';

/** from_id исходящих сообщений в ленте (отправитель «я» в диалоге). */
export function resolveSelfFromId(messages: Message[]): number | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].out) {
      return messages[i].from_id;
    }
  }
  return null;
}

export function isSelfMessage(fromId: number, selfFromId: number | null): boolean {
  if (selfFromId != null) {
    return fromId === selfFromId;
  }
  return false;
}

export function collectQuoteFromIds(quotes: QuotedMessage[]): Set<number> {
  const ids = new Set<number>();

  const walk = (quote: QuotedMessage) => {
    ids.add(quote.from_id);
    for (const nested of quote.QuotedMessages) {
      walk(nested);
    }
  };

  for (const quote of quotes) {
    walk(quote);
  }

  return ids;
}

/** Несколько отправителей во вложениях — выравниваем влево/вправо по from_id. */
export function shouldAlignQuotesBySender(quotes: QuotedMessage[]): boolean {
  return collectQuoteFromIds(quotes).size > 1;
}
