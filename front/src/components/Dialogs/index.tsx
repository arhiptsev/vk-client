import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useDb } from '../../db/DbContext';
import type { Conversation } from '../../db/types';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Dialogs'>;

export const Dialogs = ({ navigation }: Props) => {
  const { getConversations } = useDb();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить диалоги');
    } finally {
      setLoading(false);
    }
  }, [getConversations]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5181b8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={conversations}
      keyExtractor={(item) => String(item.export_id)}
      renderItem={({ item }) => {
        const { first_name, last_name } = item.Peer.UserInfo;
        const name = [first_name, last_name].filter(Boolean).join(' ') || 'Без имени';

        return (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() =>
              navigation.navigate('Dialog', { id: String(item.export_id) })
            }
          >
            <View style={styles.rowContent}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.meta}>
                ID {item.export_id} · {item._count.Message} сообщений
              </Text>
            </View>
          </Pressable>
        );
      }}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowPressed: {
    backgroundColor: '#f0f2f5',
  },
  rowContent: {
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
  },
  meta: {
    fontSize: 13,
    color: '#818c99',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e1e3e6',
    marginLeft: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  error: {
    fontSize: 15,
    color: '#e64646',
    textAlign: 'center',
  },
});
