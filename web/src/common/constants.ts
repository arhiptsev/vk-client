/** Значение из .env; в рантайме может переопределяться в MediaContext */
export const DEFAULT_MEDIA_URL = (import.meta.env.VITE_MEDIA_URL ?? '').replace(
  /\/$/,
  ''
);

/** Размер страницы ленты сообщений по умолчанию */
export const MESSAGES_PAGE_SIZE = 100;

/** Варианты размера порции при подгрузке по скроллу */
export const MESSAGE_PAGE_SIZE_OPTIONS = [100, 1000, 10000] as const;
export type MessagePageSize = (typeof MESSAGE_PAGE_SIZE_OPTIONS)[number];
