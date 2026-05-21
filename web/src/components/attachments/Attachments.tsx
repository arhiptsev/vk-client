import type { Attachment } from '../../db/types';
import { isAudioMessage, isPhoto, isVideo } from './type-guards';
import { AudioMessageView } from './AudioMessage';
import { PhotoView } from './Photo';
import { VideoView } from './Video';

export const Attachments = ({ attachments }: { attachments: Attachment[] }) => {
  const audioMessages = attachments.filter(isAudioMessage).map((a) => a.AudioMessage);
  const photos = attachments.filter(isPhoto).map((a) => a.Photo);
  const videos = attachments.filter(isVideo).map((a) => a.Video);

  return (
    <div className="attachments">
      {audioMessages.map((audio, index) => (
        <AudioMessageView key={`audio-${index}`} {...audio} />
      ))}
      {photos.map((photo, index) => (
        <PhotoView key={`photo-${index}`} {...photo} />
      ))}
      {videos.map((video, index) => (
        <VideoView key={`video-${index}`} {...video} />
      ))}
    </div>
  );
};
