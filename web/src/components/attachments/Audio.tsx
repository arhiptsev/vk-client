import type { Audio } from '../../db/types';

const formatAudioLabel = (artist: string | null, title: string | null) => {
  const parts = [artist, title].filter((part) => !!part?.trim());
  return parts.length > 0 ? parts.join(' — ') : 'Аудио';
};

export const AudioView = ({ artist, title }: Audio) => (
  <div className="audio-track">{formatAudioLabel(artist, title)}</div>
);
