import React, { useMemo } from 'react';

import { Media as MediaType, Attachment } from '@graphql/types';

import { AudioMessage } from './AudioMessage';
import { Photo } from './Photo';
import { Video } from './Video';

import { isAudioMessage, isPhoto, isVideo } from './type-guards';

export const isMedia = (key: MediaType | undefined): key is MediaType => !!key;

export const Attachments = ({ attachments }: { attachments: Attachment[] }) => {
  const medias = useMemo(
    () => attachments.map((i) => i.media).filter(isMedia),
    []
  );

  const audioMessages = medias.filter(isAudioMessage);
  const photos = medias.filter(isPhoto);
  const videos = medias.filter(isVideo);

  return (
    <>
      {audioMessages.map((audioMessage) => (
        <AudioMessage {...audioMessage} />
      ))}
      {photos.map((photo) => (
        <Photo {...photo} />
      ))}
      {videos.map((video) => (
        <Video {...video} />
      ))}
    </>
  );
};
