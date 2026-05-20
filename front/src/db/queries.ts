import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  Attachment,
  AudioMessage,
  Conversation,
  Message,
  Photo,
  PhotoSize,
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
};

type AttachmentRow = {
  export_id: number;
  message_export_id: number;
  type: string;
};

async function loadAttachmentsForMessages(
  db: SQLiteDatabase,
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

export async function getConversations(db: SQLiteDatabase): Promise<Conversation[]> {
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
  db: SQLiteDatabase,
  conversationExportId: number,
  skip: number
): Promise<Message[]> {
  const rows = await db.getAllAsync<MessageRow>(
    `SELECT export_id, text, date, out
     FROM Message
     WHERE conversation_export_id = ?
     ORDER BY date DESC
     LIMIT 100 OFFSET ?`,
    [conversationExportId, skip]
  );

  const messageIds = rows.map((r) => r.export_id);
  const attachmentsByMessage = await loadAttachmentsForMessages(db, messageIds);

  return rows.map((row) => ({
    ...row,
    Attachment: attachmentsByMessage.get(row.export_id) ?? [],
  }));
}
