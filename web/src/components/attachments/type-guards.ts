import type { Attachment, Audio, AudioMessage, Photo, Video } from '../../db/types';

export const isAudioMessage = (
  a: Attachment
): a is Attachment & { AudioMessage: AudioMessage } =>
  a.type === 'audio_message' && a.AudioMessage != null;

export const isAudio = (a: Attachment): a is Attachment & { Audio: Audio } =>
  a.type === 'audio' && a.Audio != null;

export const isPhoto = (a: Attachment): a is Attachment & { Photo: Photo } =>
  a.type === 'photo' && a.Photo != null;

export const isVideo = (a: Attachment): a is Attachment & { Video: Video } =>
  a.type === 'video' && a.Video != null;
