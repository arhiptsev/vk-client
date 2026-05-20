import { StyleSheet, View } from 'react-native';

import type { Attachment } from '../../../../db/types';
import { AudioMessage } from './AudioMessage';
import { Photo } from './Photo';
import { Video } from './Video';
import { isAudioMessage, isPhoto, isVideo } from './type-guards';

export const Attachments = ({ attachments }: { attachments: Attachment[] }) => {
  const audioMessages = attachments.filter(isAudioMessage).map((a) => a.AudioMessage);
  const photos = attachments.filter(isPhoto).map((a) => a.Photo);
  const videos = attachments.filter(isVideo).map((a) => a.Video);

  return (
    <View style={styles.container}>
      {audioMessages.map((audio, index) => (
        <AudioMessage key={`audio-${index}`} {...audio} />
      ))}
      {photos.map((photo, index) => (
        <Photo key={`photo-${index}`} {...photo} />
      ))}
      {videos.map((video, index) => (
        <Video key={`video-${index}`} {...video} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginTop: 4,
  },
});
