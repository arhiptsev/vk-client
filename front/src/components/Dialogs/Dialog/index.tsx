import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRef } from 'react';

import { Attachments } from './Attachments';
import { useScrollLoading } from './hooks';
import type { Message } from './hooks';
import type { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Dialog'>;

const formatDate = (timestamp?: number | null) => {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MessageBubble = ({ message }: { message: Message }) => {
  const incoming = !!message.out;

  return (
    <View style={[styles.messageRow, incoming && styles.messageRowIncoming]}>
      <View style={[styles.bubble, incoming ? styles.bubbleIncoming : styles.bubbleOutgoing]}>
        {!!message.text && <Text style={styles.messageText}>{message.text}</Text>}
        {message.Attachment.length > 0 && (
          <Attachments attachments={message.Attachment} />
        )}
        <Text style={styles.messageDate}>{formatDate(message.date)}</Text>
      </View>
    </View>
  );
};

export const Dialog = ({ route }: Props) => {
  const conversationId = Number(route.params.id);
  const listRef = useRef<FlatList<Message>>(null);

  const { scrollHandler, items, loading, loadingMore, error } =
    useScrollLoading(conversationId);

  const reversedMessages = [...items].reverse();

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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={reversedMessages}
        keyExtractor={(item) => String(item.export_id)}
        renderItem={({ item }) => <MessageBubble message={item} />}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListHeaderComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.headerLoader} color="#5181b8" />
          ) : null
        }
      />
      <View style={styles.toolbar}>
        <Pressable
          style={styles.toolbarButton}
          onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
        >
          <Text style={styles.toolbarButtonText}>↑</Text>
        </Pressable>
        <Text style={styles.count}>{items.length}</Text>
        <Pressable
          style={styles.toolbarButton}
          onPress={() => listRef.current?.scrollToEnd({ animated: true })}
        >
          <Text style={styles.toolbarButtonText}>↓</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#e5ddd5',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    gap: 4,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 2,
  },
  messageRowIncoming: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    minWidth: 120,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 6,
  },
  bubbleOutgoing: {
    backgroundColor: '#ffffff',
  },
  bubbleIncoming: {
    backgroundColor: '#dcf8c6',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#303030',
    marginBottom: 4,
  },
  messageDate: {
    fontSize: 11,
    color: '#667781',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  toolbar: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#f7f8fa',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#dce1e6',
  },
  toolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5181b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  count: {
    fontSize: 12,
    color: '#5181b8',
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#e64646',
    padding: 16,
    textAlign: 'center',
  },
  headerLoader: {
    marginVertical: 8,
  },
});
