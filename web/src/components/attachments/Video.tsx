import { useMedia } from '../../media/MediaContext';
import type { Video } from '../../db/types';

export const VideoView = ({ title, VideoFile }: Video) => {
  const { getVideoUrl } = useMedia();
  const file = VideoFile?.[0]?.file;
  const src = file ? getVideoUrl(file) : null;

  return (
    <div className="video-card">
      <div>{title ?? 'Видео'}</div>
      {file && !src && (
        <span className="placeholder">
          {file} (выберите папку с медиа или укажите URL сервера)
        </span>
      )}
      {src && (
        <video className="video-player" src={src} controls preload="metadata" />
      )}
    </div>
  );
};
