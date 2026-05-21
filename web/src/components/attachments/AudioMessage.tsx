import { useCallback, useEffect, useRef, useState } from 'react';

import { useMedia } from '../../media/MediaContext';
import type { AudioMessage } from '../../db/types';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const AudioMessageView = ({ file, duration }: AudioMessage) => {
  const { getAudioUrl } = useMedia();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration ?? 0);
  const isSeekingRef = useRef(false);

  const src = file ? getAudioUrl(file) : null;

  useEffect(() => {
    if (duration != null && duration > 0) {
      setTotalDuration(duration);
    }
  }, [duration]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !src) return;

    const onTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(el.currentTime);
      }
    };

    const onLoadedMetadata = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setTotalDuration(el.duration);
      }
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
      el.currentTime = 0;
    };

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('loadedmetadata', onLoadedMetadata);
    el.addEventListener('durationchange', onLoadedMetadata);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
      el.removeEventListener('durationchange', onLoadedMetadata);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  }, []);

  const onSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const el = audioRef.current;
      if (!el || totalDuration <= 0) return;

      const ratio = Number(e.target.value) / 100;
      const nextTime = ratio * totalDuration;
      el.currentTime = nextTime;
      setCurrentTime(nextTime);
    },
    [totalDuration]
  );

  if (!file) {
    return <span className="placeholder">Нет файла аудиосообщения</span>;
  }

  if (!src) {
    return (
      <span className="placeholder">
        Аудио: {file} (выберите папку с медиа или укажите URL сервера)
      </span>
    );
  }

  const progressPercent =
    totalDuration > 0 ? Math.min(100, (currentTime / totalDuration) * 100) : 0;

  return (
    <div className="audio-message">
      <button
        type="button"
        className="audio-message-play"
        onClick={toggle}
        aria-label={playing ? 'Пауза' : 'Воспроизвести'}
      >
        {playing ? '⏸' : '▶'}
      </button>
      <div className="audio-message-body">
        <input
          type="range"
          className="audio-message-progress"
          min={0}
          max={100}
          step={0.1}
          value={progressPercent}
          onChange={onSeek}
          onPointerDown={() => {
            isSeekingRef.current = true;
          }}
          onPointerUp={() => {
            isSeekingRef.current = false;
          }}
          onPointerCancel={() => {
            isSeekingRef.current = false;
          }}
          aria-label="Прогресс воспроизведения"
        />
        <span className="audio-message-time">
          {formatTime(currentTime)}
          <span className="audio-message-time-sep"> / </span>
          {formatTime(totalDuration)}
        </span>
      </div>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};
