import { MESSAGES_PAGE_SIZE } from '../common/constants';
import type { SqlDatabase } from './database';
import type {
  Attachment,
  AudioMessage,
  Conversation,
  Message,
  MessageSender,
  Photo,
  PhotoSize,
  QuotedMessage,
  Video,
  VideoFile,
} from './types';

type ConversationRow = {
  export_id: number;
  last_message_id: number | null;
  peer_export_id: number | null;
  first_name: string | null;
  last_name: string | null;
  message_count: number;
};

type MessageRow = {
  export_id: number;
  text: string;
  date: number;
  out: number | null;
  from_id: number;
  reply_id: number | null;
  parent_id: number | null;
  conversation_export_id: number | null;
  sender_first_name: string | null;
  sender_last_name: string | null;
};

const MESSAGE_FEED_SQL = `
  SELECT
    m.export_id,
    m.text,
    m.date,
    m.out,
    m.from_id,
    m.reply_id,
    m.parent_id,
    m.conversation_export_id,
    u.first_name AS sender_first_name,
    u.last_name AS sender_last_name
  FROM Message m
  LEFT JOIN UserInfo u ON u.id = m.from_id
  WHERE m.conversation_export_id = ?
  ORDER BY m.date DESC
  LIMIT ${MESSAGES_PAGE_SIZE} OFFSET ?
`;

function mapSender(
  first_name: string | null,
  last_name: string | null
): MessageSender | null {
  if (first_name == null && last_name == null) return null;
  return { first_name, last_name };
}

/**
 * В экспорте VK строка с reply_id/parent_id — это цитируемое сообщение;
 * reply_id/parent_id указывает на export_id ответа в ленте диалога.
 */
async function loadNestedQuotesForMessages(
  db: SqlDatabase,
  replyToIds: number[]
): Promise<Map<number, QuotedMessage>> {
  const result = new Map<number, QuotedMessage>();
  if (replyToIds.length === 0) {
    return result;
  }

  const placeholders = replyToIds.map(() => '?').join(',');
  const rows = await db.getAllAsync<MessageRow>(
    `SELECT
       o.export_id,
       o.text,
       o.date,
       o.out,
       o.from_id,
       o.reply_id,
       o.parent_id,
       o.conversation_export_id,
       u.first_name AS sender_first_name,
       u.last_name AS sender_last_name
     FROM Message o
     LEFT JOIN UserInfo u ON u.id = o.from_id
     WHERE o.conversation_export_id IS NULL
       AND (
         o.reply_id IN (${placeholders})
         OR o.parent_id IN (${placeholders})
       )`,
    [...replyToIds, ...replyToIds]
  );

  const orphanIds = rows.map((r) => r.export_id);
  const attachmentsByOrphan = await loadAttachmentsForMessages(db, orphanIds);

  for (const row of rows) {
    const replyToId = row.reply_id ?? row.parent_id;
    if (replyToId == null) {
      continue;
    }

    result.set(replyToId, {
      export_id: row.export_id,
      text: row.text,
      date: row.date,
      out: row.out,
      Sender: mapSender(row.sender_first_name, row.sender_last_name),
      Attachment: attachmentsByOrphan.get(row.export_id) ?? [],
    });
  }

  return result;
}

type AttachmentRow = {
  export_id: number;
  message_export_id: number;
  type: string;
};

async function loadAttachmentsForMessages(
  db: SqlDatabase,
  messageIds: number[]
): Promise<Map<number, Attachment[]>> {
  const result = new Map<number, Attachment[]>();
  if (messageIds.length === 0) {
    return result;
  }

  const placeholders = messageIds.map(() => '?').join(',');
  const attachments = await db.getAllAsync<AttachmentRow>(
    `SELECT export_id, message_export_id, type
     FROM Attachment
     WHERE message_export_id IN (${placeholders})`,
    messageIds
  );

  if (attachments.length === 0) {
    return result;
  }

  const attachmentIds = attachments.map((a) => a.export_id);

  const audioMessages = await db.getAllAsync<AudioMessage>(
    `SELECT export_id, attachment_export_id, file, duration, link_mp3, link_ogg
     FROM AudioMessage
     WHERE attachment_export_id IN (${attachmentIds.map(() => '?').join(',')})`,
    attachmentIds
  );

  const photos = await db.getAllAsync<Photo & { attachment_export_id: number }>(
    `SELECT export_id, attachment_export_id
     FROM Photo
     WHERE attachment_export_id IN (${attachmentIds.map(() => '?').join(',')})`,
    attachmentIds
  );

  const photoIds = photos.map((p) => p.export_id);
  const photoSizes: PhotoSize[] =
    photoIds.length > 0
      ? await db.getAllAsync<PhotoSize>(
          `SELECT export_id, height, url, type, width, export_photo_id, file
           FROM PhotoSize
           WHERE export_photo_id IN (${photoIds.map(() => '?').join(',')})`,
          photoIds
        )
      : [];

  const videos = await db.getAllAsync<Video & { attachment_export_id: number }>(
    `SELECT export_id, attachment_export_id, title
     FROM Video
     WHERE attachment_export_id IN (${attachmentIds.map(() => '?').join(',')})`,
    attachmentIds
  );

  const videoIds = videos.map((v) => v.export_id);
  const videoFiles: VideoFile[] =
    videoIds.length > 0
      ? await db.getAllAsync<VideoFile>(
          `SELECT export_id, video_export_id, file, mp4_720
           FROM VideoFile
           WHERE video_export_id IN (${videoIds.map(() => '?').join(',')})`,
          videoIds
        )
      : [];

  const audioByAttachment = new Map(
    audioMessages
      .filter((a) => a.attachment_export_id != null)
      .map((a) => [a.attachment_export_id!, a])
  );

  const photoByAttachment = new Map(
    photos.map((p) => [
      p.attachment_export_id,
      {
        ...p,
        PhotoSize: photoSizes.filter((s) => s.export_photo_id === p.export_id),
      },
    ])
  );

  const videoByAttachment = new Map(
    videos.map((v) => [
      v.attachment_export_id,
      {
        ...v,
        VideoFile: videoFiles.filter((f) => f.video_export_id === v.export_id),
      },
    ])
  );

  for (const row of attachments) {
    const item: Attachment = { ...row };
    if (row.type === 'audio_message') {
      item.AudioMessage = audioByAttachment.get(row.export_id);
    }
    if (row.type === 'photo') {
      item.Photo = photoByAttachment.get(row.export_id);
    }
    if (row.type === 'video') {
      item.Video = videoByAttachment.get(row.export_id);
    }

    const list = result.get(row.message_export_id) ?? [];
    list.push(item);
    result.set(row.message_export_id, list);
  }

  return result;
}

function rowToMessage(
  row: MessageRow,
  attachmentsByMessage: Map<number, Attachment[]>,
  nestedQuotesByReplyTo: Map<number, QuotedMessage>
): Message {
  return {
    export_id: row.export_id,
    text: row.text,
    date: row.date,
    out: row.out,
    from_id: row.from_id,
    reply_id: row.reply_id,
    parent_id: row.parent_id,
    Sender: mapSender(row.sender_first_name, row.sender_last_name),
    QuotedMessage: nestedQuotesByReplyTo.get(row.export_id) ?? null,
    Attachment: attachmentsByMessage.get(row.export_id) ?? [],
  };
}

export async function getConversations(db: SqlDatabase): Promise<Conversation[]> {
  const rows = await db.getAllAsync<ConversationRow>(
    `SELECT
       c.export_id,
       c.last_message_id,
       p.export_id AS peer_export_id,
       u.first_name,
       u.last_name,
       (SELECT COUNT(*) FROM Message m WHERE m.conversation_export_id = c.export_id) AS message_count
     FROM Conversation c
     LEFT JOIN Peer p ON p.conversation_export_id = c.export_id
     LEFT JOIN UserInfo u ON u.export_peer_id = p.export_id
     ORDER BY c.export_id`
  );

  return rows.map((row) => ({
    export_id: row.export_id,
    last_message_id: row.last_message_id,
    _count: { Message: row.message_count },
    Peer: {
      export_id: row.peer_export_id ?? 0,
      conversation_export_id: row.export_id,
      UserInfo: {
        export_id: 0,
        export_peer_id: row.peer_export_id ?? 0,
        first_name: row.first_name,
        last_name: row.last_name,
      },
    },
  }));
}

export async function getMessages(
  db: SqlDatabase,
  conversationExportId: number,
  skip: number
): Promise<Message[]> {
  const rows = await db.getAllAsync<MessageRow>(MESSAGE_FEED_SQL, [
    conversationExportId,
    skip,
  ]);

  const messageIds = rows.map((r) => r.export_id);

  const [attachmentsByMessage, nestedQuotesByReplyTo] = await Promise.all([
    loadAttachmentsForMessages(db, messageIds),
    loadNestedQuotesForMessages(db, messageIds),
  ]);

  return rows.map((row) =>
    rowToMessage(row, attachmentsByMessage, nestedQuotesByReplyTo)
  );
}
