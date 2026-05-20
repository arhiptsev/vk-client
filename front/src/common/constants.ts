/**
 * Базовый URL сервера с медиа (без завершающего слэша).
 * Задаётся в .env: EXPO_PUBLIC_MEDIA_URL=https://media.example.com
 */
export const MEDIA_URL = (
  process.env.EXPO_PUBLIC_MEDIA_URL ?? ''
).replace(/\/$/, '');

export const getPhotoUrl = (file: string) => `${MEDIA_URL}/photos/${file}`;
export const getAudioUrl = (file: string) => `${MEDIA_URL}/audios/${file}`;
export const getVideoUrl = (file: string) => `${MEDIA_URL}/videos/${file}`;

export const isMediaServerConfigured = () => MEDIA_URL.length > 0;
