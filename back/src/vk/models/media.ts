import { createUnionType } from '@nestjs/graphql';
import { AudioMessage } from './audio-message';
import { Photo } from './photo';
import { Video } from './video';

export const Media = createUnionType({
  name: 'Media',
  types: () => [Video, AudioMessage, Photo],
  resolveType({ type }) {
    if (type === 'video') return Video;
    if (type === 'photo') return Photo;
    if (type === 'audioMessage') return AudioMessage;
    console.log('fgfg');
    return null;
  },
});
