import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import {
  getPhotoUrl,
  isMediaServerConfigured,
} from '../../../../../common/constants';
import type { Photo as PhotoType } from '../../../../../db/types';

export const Photo = ({ PhotoSize }: PhotoType) => {
  const file = PhotoSize?.find((size) => size.file)?.file;

  if (!file) {
    return <Text style={styles.placeholder}>Нет данных о файле фото</Text>;
  }

  if (!isMediaServerConfigured()) {
    return (
      <Text style={styles.placeholder}>
        Фото: {file} (задайте EXPO_PUBLIC_MEDIA_URL)
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: getPhotoUrl(file) }}
        style={styles.image}
        contentFit="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 220,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#d9d9d9',
  },
  placeholder: {
    fontSize: 13,
    color: '#667781',
  },
});
