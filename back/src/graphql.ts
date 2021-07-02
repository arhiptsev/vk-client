
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface VideoFile {
    export_id?: number;
    mp4_240?: string;
    mp4_360?: string;
    mp4_480?: string;
    mp4_720?: string;
    hls?: string;
    video_export_id?: number;
    dash_uni?: string;
    dash_sep?: string;
    external?: string;
    mp4_1080?: string;
    dash_webm?: string;
    live?: string;
    file?: string;
}

export interface Attachment {
    export_id?: number;
    message_export_id?: number;
    type?: string;
    media?: Media;
}

export interface Video {
    export_id?: number;
    access_key?: string;
    can_comment?: number;
    can_like?: number;
    can_repost?: number;
    can_subscribe?: number;
    can_add_to_faves?: number;
    can_add?: number;
    date?: number;
    description?: string;
    duration?: number;
    width?: number;
    height?: number;
    id?: number;
    owner_id?: number;
    title?: string;
    is_favorite?: boolean;
    player?: string;
    added?: number;
    track_code?: string;
    type?: string;
    views?: number;
    ov_id?: string;
    can_edit?: number;
    can_attach_link?: number;
    is_private?: number;
    platform?: string;
    local_views?: number;
    comments?: number;
    repeat?: number;
    processing?: number;
    live_start_time?: number;
    live_notify?: number;
    user_id?: number;
    content_restricted?: number;
    content_restricted_message?: string;
    balance?: number;
    converting?: number;
    spectators?: number;
    is_subscribed?: number;
    attachment_export_id?: number;
    album_id?: number;
    VideoFile?: VideoFile;
}

export interface AudioMessage {
    export_id?: number;
    attachment_export_id?: number;
    access_key?: string;
    transcript_error?: number;
    duration?: number;
    id?: number;
    link_mp3?: string;
    link_ogg?: string;
    owner_id?: number;
    waveform?: number[];
    transcript_state?: string;
    transcript?: string;
    file?: string;
    type?: string;
}

export interface Photo {
    export_id?: number;
    album_id?: number;
    date?: number;
    id?: number;
    owner_id?: number;
    has_tags?: boolean;
    lat?: number;
    long?: number;
    access_key?: string;
    text?: string;
    user_id?: number;
    post_id?: number;
    attachment_export_id?: number;
    photo_256?: string;
    place?: string;
    type?: string;
}

export interface Message {
    export_id?: number;
    id?: number;
    parent_id?: number;
    text?: string;
    user_id?: number;
    from_id?: number;
    peer_id?: number;
    ref?: string;
    ref_source?: string;
    date?: number;
    read_state?: boolean;
    out?: number;
    update_time?: number;
    important?: boolean;
    random_id?: number;
    is_hidden?: boolean;
    conversation_message_id?: number;
    payload?: string;
    conversation_export_id?: number;
    reply_id?: number;
    ParentMessage?: Message;
    ReplyMessage?: Message;
    Attachment?: Attachment[];
}

export interface UserInfo {
    export_id?: number;
    export_peer_id?: number;
    first_name?: string;
    id?: number;
    last_name?: string;
    can_access_closed?: boolean;
    is_closed?: boolean;
    photo_max?: string;
    photo_file?: string;
    deactivated?: string;
    can_invite_to_chats?: boolean;
}

export interface Peer {
    export_id?: string;
    conversation_export_id?: number;
    id?: number;
    type?: string;
    local_id?: number;
    Conversation?: Conversation;
    UserInfo?: UserInfo;
}

export interface Conversation {
    export_id?: number;
    last_message_id?: number;
    in_read?: number;
    out_read?: number;
    is_marked_unread?: boolean;
    important?: boolean;
    can_send_money?: boolean;
    can_receive_money?: boolean;
    Message?: Message[];
    Peer?: Peer;
}

export interface IQuery {
    conversation(id: number): Conversation | Promise<Conversation>;
    conversations(): Conversation[] | Promise<Conversation[]>;
    message(id: number): Message | Promise<Message>;
    messages(): Message[] | Promise<Message[]>;
    attachment(id: number): Attachment | Promise<Attachment>;
    attachments(): Attachment[] | Promise<Attachment[]>;
}

export type Media = Video | AudioMessage | Photo;
