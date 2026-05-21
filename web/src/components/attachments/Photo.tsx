import { useMedia } from '../../media/MediaContext';
import type { Photo } from '../../db/types';

export const PhotoView = ({ PhotoSize }: Photo) => {
  const { getPhotoUrl } = useMedia();
  const file = PhotoSize?.find((size) => size.file)?.file;

  if (!file) {
    return <span className="placeholder">Нет данных о файле фото</span>;
  }

  const src = getPhotoUrl(file);
  if (!src) {
    return (
      <span className="placeholder">
        Фото: {file} (выберите папку с медиа или укажите URL сервера)
      </span>
    );
  }

  return <img src={src} alt="" loading="lazy" />;
};
