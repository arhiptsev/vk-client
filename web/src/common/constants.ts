/** Значение из .env; в рантайме может переопределяться в MediaContext */
export const DEFAULT_MEDIA_URL = (import.meta.env.VITE_MEDIA_URL ?? '').replace(
  /\/$/,
  ''
);
