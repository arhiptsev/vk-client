
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface PhotoSize {
    export_id: number;
    height?: Nullable<number>;
    url: string;
    type?: Nullable<string>;
    width?: Nullable<number>;
    export_photo_id: number;
    file?: Nullable<string>;
}

export interface VideoFile {
    export_id?: Nullable<number>;
    mp4_240?: Nullable<string>;
    mp4_360?: Nullable<string>;
    mp4_480?: Nullable<string>;
    mp4_720?: Nullable<string>;
    hls?: Nullable<string>;
    video_export_id?: Nullable<number>;
    dash_uni?: Nullable<string>;
    dash_sep?: Nullable<string>;
    external?: Nullable<string>;
    mp4_1080?: Nullable<string>;
    dash_webm?: Nullable<string>;
    live?: Nullable<string>;
    file?: Nullable<string>;
}

export interface Attachment {
    export_id?: Nullable<number>;
    message_export_id?: Nullable<number>;
    type?: Nullable<string>;
    media?: Nullable<Media>;
}

export interface Video {
    export_id?: Nullable<number>;
    access_key?: Nullable<string>;
    can_comment?: Nullable<number>;
    can_like?: Nullable<number>;
    can_repost?: Nullable<number>;
    can_subscribe?: Nullable<number>;
    can_add_to_faves?: Nullable<number>;
    can_add?: Nullable<number>;
    date?: Nullable<number>;
    description?: Nullable<string>;
    duration?: Nullable<number>;
    width?: Nullable<number>;
    height?: Nullable<number>;
    id?: Nullable<number>;
    owner_id?: Nullable<number>;
    title?: Nullable<string>;
    is_favorite?: Nullable<boolean>;
    player?: Nullable<string>;
    added?: Nullable<number>;
    track_code?: Nullable<string>;
    type?: Nullable<string>;
    views?: Nullable<number>;
    ov_id?: Nullable<string>;
    can_edit?: Nullable<number>;
    can_attach_link?: Nullable<number>;
    is_private?: Nullable<number>;
    platform?: Nullable<string>;
    local_views?: Nullable<number>;
    comments?: Nullable<number>;
    repeat?: Nullable<number>;
    processing?: Nullable<number>;
    live_start_time?: Nullable<number>;
    live_notify?: Nullable<number>;
    user_id?: Nullable<number>;
    content_restricted?: Nullable<number>;
    content_restricted_message?: Nullable<string>;
    balance?: Nullable<number>;
    converting?: Nullable<number>;
    spectators?: Nullable<number>;
    is_subscribed?: Nullable<number>;
    attachment_export_id?: Nullable<number>;
    album_id?: Nullable<number>;
    VideoFile?: Nullable<VideoFile>;
}

export interface AudioMessage {
    export_id?: Nullable<number>;
    attachment_export_id?: Nullable<number>;
    access_key?: Nullable<string>;
    transcript_error?: Nullable<number>;
    duration?: Nullable<number>;
    id?: Nullable<number>;
    link_mp3?: Nullable<string>;
    link_ogg?: Nullable<string>;
    owner_id?: Nullable<number>;
    waveform?: Nullable<number[]>;
    transcript_state?: Nullable<string>;
    transcript?: Nullable<string>;
    file?: Nullable<string>;
    type?: Nullable<string>;
}

export interface Photo {
    export_id?: Nullable<number>;
    album_id?: Nullable<number>;
    date?: Nullable<number>;
    id?: Nullable<number>;
    owner_id?: Nullable<number>;
    has_tags?: Nullable<boolean>;
    lat?: Nullable<number>;
    long?: Nullable<number>;
    access_key?: Nullable<string>;
    text?: Nullable<string>;
    user_id?: Nullable<number>;
    post_id?: Nullable<number>;
    attachment_export_id?: Nullable<number>;
    photo_256?: Nullable<string>;
    place?: Nullable<string>;
    type?: Nullable<string>;
    PhotoSize?: Nullable<PhotoSize[]>;
}

export interface Message {
    export_id?: Nullable<number>;
    id?: Nullable<number>;
    parent_id?: Nullable<number>;
    text?: Nullable<string>;
    user_id?: Nullable<number>;
    from_id?: Nullable<number>;
    peer_id?: Nullable<number>;
    ref?: Nullable<string>;
    ref_source?: Nullable<string>;
    date?: Nullable<number>;
    read_state?: Nullable<boolean>;
    out?: Nullable<number>;
    update_time?: Nullable<number>;
    important?: Nullable<boolean>;
    random_id?: Nullable<number>;
    is_hidden?: Nullable<boolean>;
    conversation_message_id?: Nullable<number>;
    payload?: Nullable<string>;
    conversation_export_id?: Nullable<number>;
    reply_id?: Nullable<number>;
    ParentMessage?: Nullable<Message>;
    ReplyMessage?: Nullable<Message>;
    Attachment?: Nullable<Attachment[]>;
}

export interface UserInfo {
    export_id?: Nullable<number>;
    export_peer_id?: Nullable<number>;
    first_name?: Nullable<string>;
    id?: Nullable<number>;
    last_name?: Nullable<string>;
    can_access_closed?: Nullable<boolean>;
    is_closed?: Nullable<boolean>;
    photo_max?: Nullable<string>;
    photo_file?: Nullable<string>;
    deactivated?: Nullable<string>;
    can_invite_to_chats?: Nullable<boolean>;
}

export interface Peer {
    export_id?: Nullable<string>;
    conversation_export_id?: Nullable<number>;
    id?: Nullable<number>;
    type?: Nullable<string>;
    local_id?: Nullable<number>;
    Conversation?: Nullable<Conversation>;
    UserInfo: UserInfo;
}

export interface Conversation {
    export_id: number;
    last_message_id?: Nullable<number>;
    in_read?: Nullable<number>;
    out_read?: Nullable<number>;
    is_marked_unread?: Nullable<boolean>;
    important?: Nullable<boolean>;
    can_send_money?: Nullable<boolean>;
    can_receive_money?: Nullable<boolean>;
    Message?: Nullable<Message[]>;
    Peer: Peer;
}

export interface IQuery {
    conversation(id: number): Conversation | Promise<Conversation>;
    conversations(): Conversation[] | Promise<Conversation[]>;
    message(id: number): Message | Promise<Message>;
    messages(conversation_id: number, skip: number): Message[] | Promise<Message[]>;
    attachment(id: number): Attachment | Promise<Attachment>;
    attachments(): Attachment[] | Promise<Attachment[]>;
}

export type Media = Video | AudioMessage | Photo;
type Nullable<T> = T | null;
