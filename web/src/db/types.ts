export type UserInfo = {
  export_id: number;
  export_peer_id: number;
  first_name: string | null;
  last_name: string | null;
};

export type Peer = {
  export_id: number;
  conversation_export_id: number;
  UserInfo: UserInfo;
};

export type Conversation = {
  export_id: number;
  last_message_id: number | null;
  Peer: Peer;
  _count: { Message: number };
};

export type PhotoSize = {
  export_id: number;
  height: number | null;
  url: string;
  type: string | null;
  width: number | null;
  export_photo_id: number;
  file: string | null;
};

export type Photo = {
  export_id: number;
  attachment_export_id: number;
  PhotoSize: PhotoSize[];
};

export type AudioMessage = {
  export_id: number;
  attachment_export_id: number | null;
  file: string | null;
  duration: number | null;
  link_mp3: string | null;
  link_ogg: string | null;
};

/** Музыкальное вложение (таблица Audio) */
export type Audio = {
  export_id: number;
  attachment_export_id: number | null;
  artist: string | null;
  title: string | null;
};

export type VideoFile = {
  export_id: number;
  video_export_id: number | null;
  file: string | null;
  mp4_720: string | null;
};

export type Video = {
  export_id: number;
  attachment_export_id: number | null;
  title: string | null;
  VideoFile: VideoFile[];
};

export type Attachment = {
  export_id: number;
  message_export_id: number;
  type: string;
  Photo?: Photo;
  AudioMessage?: AudioMessage;
  Audio?: Audio;
  Video?: Video;
};

export type MessageSender = {
  first_name: string | null;
  last_name: string | null;
};

/** Вложенное сообщение (ответ или пересланное) */
export type QuotedMessage = {
  export_id: number;
  text: string;
  date: number;
  out: number | null;
  from_id: number;
  parent_id: number | null;
  Sender: MessageSender | null;
  QuotedMessages: QuotedMessage[];
  Attachment: Attachment[];
};

export type Message = {
  export_id: number;
  text: string;
  date: number;
  out: number | null;
  from_id: number;
  reply_id: number | null;
  parent_id: number | null;
  Sender: MessageSender | null;
  QuotedMessages: QuotedMessage[];
  Attachment: Attachment[];
};
