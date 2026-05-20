import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  getAudioUrl,
  isMediaServerConfigured,
} from '../../../../../common/constants';
import type { AudioMessage as AudioMessageType } from '../../../../../db/types';

export const AudioMessage = ({ file, duration }: AudioMessageType) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  const togglePlayback = async () => {
    if (!file || !isMediaServerConfigured()) return;

    if (sound) {
      if (playing) {
        await sound.pauseAsync();
        setPlaying(false);
      } else {
        await sound.playAsync();
        setPlaying(true);
      }
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: getAudioUrl(file) },
      { shouldPlay: true }
    );
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setPlaying(false);
      }
    });
    setSound(newSound);
    setPlaying(true);
  };

  if (!file) {
    return <Text style={styles.placeholder}>Нет файла аудиосообщения</Text>;
  }

  if (!isMediaServerConfigured()) {
    return (
      <Text style={styles.placeholder}>
        Аудио: {file} (задайте EXPO_PUBLIC_MEDIA_URL)
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={togglePlayback}>
        <Text style={styles.buttonText}>{playing ? '⏸' : '▶'}</Text>
      </Pressable>
      {duration != null && (
        <Text style={styles.duration}>{Math.round(duration)} с</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5181b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  duration: {
    fontSize: 12,
    color: '#667781',
  },
  placeholder: {
    fontSize: 13,
    color: '#667781',
  },
});
