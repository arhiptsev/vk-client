import type { Attachment, AudioMessage, Photo, Video } from '../../../../db/types';

export const isAudioMessage = (
  attachment: Attachment
): attachment is Attachment & { AudioMessage: AudioMessage } =>
  attachment.type === 'audio_message' && !!attachment.AudioMessage;

export const isPhoto = (
  attachment: Attachment
): attachment is Attachment & { Photo: Photo } =>
  attachment.type === 'photo' && !!attachment.Photo;

export const isVideo = (
  attachment: Attachment
): attachment is Attachment & { Video: Video } =>
  attachment.type === 'video' && !!attachment.Video;
