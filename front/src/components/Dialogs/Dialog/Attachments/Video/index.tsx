import { StyleSheet, Text, View } from 'react-native';

import { isMediaServerConfigured } from '../../../../../common/constants';
import type { Video as VideoType } from '../../../../../db/types';

export const Video = ({ title, VideoFile }: VideoType) => {
  const file = VideoFile?.[0]?.file;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? 'Видео'}</Text>
      {file && !isMediaServerConfigured() && (
        <Text style={styles.meta}>
          {file} (задайте EXPO_PUBLIC_MEDIA_URL)
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    gap: 4,
  },
  title: {
    fontSize: 13,
    color: '#303030',
  },
  meta: {
    fontSize: 12,
    color: '#667781',
  },
});
