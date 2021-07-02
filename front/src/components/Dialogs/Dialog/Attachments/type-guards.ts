import { AudioMessage, Media, Photo, Video } from '@graphql/types';

export const isAudioMessage = (key: Media): key is AudioMessage =>
  key.type === 'audioMessage';

export const isPhoto = (key: Media): key is Photo => key.type === 'photo';

export const isVideo = (key: Media): key is Video => key.type === 'video';
