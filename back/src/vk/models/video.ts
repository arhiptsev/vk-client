import { Field, Int, ObjectType } from '@nestjs/graphql';
// import { Message } from './message';

@ObjectType()
export class VideoFile {
  @Field(() => Int, { nullable: true })
  export_id?: number;

  @Field({ nullable: true })
  mp4_240?: string;

  @Field({ nullable: true })
  mp4_360?: string;

  @Field({ nullable: true })
  mp4_480?: string;

  @Field({ nullable: true })
  mp4_720?: string;

  @Field({ nullable: true })
  hls?: string;

  @Field(() => Int, { nullable: true })
  video_export_id?: number;

  @Field({ nullable: true })
  dash_uni?: string;

  @Field({ nullable: true })
  dash_sep?: string;

  @Field({ nullable: true })
  external?: string;

  @Field({ nullable: true })
  mp4_1080?: string;

  @Field({ nullable: true })
  dash_webm?: string;

  @Field({ nullable: true })
  live?: string;

  @Field({ nullable: true })
  file?: string;
}

@ObjectType()
export class Video {
  @Field(() => Int, { nullable: true })
  export_id?: number;

  @Field({ nullable: true })
  access_key?: string;

  @Field(() => Int, { nullable: true })
  can_comment?: number;

  @Field(() => Int, { nullable: true })
  can_like?: number;

  @Field(() => Int, { nullable: true })
  can_repost?: number;

  @Field(() => Int, { nullable: true })
  can_subscribe?: number;

  @Field(() => Int, { nullable: true })
  can_add_to_faves?: number;

  @Field(() => Int, { nullable: true })
  can_add?: number;

  @Field(() => Int, { nullable: true })
  date?: number;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => Int, { nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  owner_id?: number;

  @Field({ nullable: true })
  title?: string;

  @Field(() => Boolean, { nullable: true })
  is_favorite?: boolean;

  @Field({ nullable: true })
  player?: string;

  @Field(() => Int, { nullable: true })
  added?: number;

  @Field({ nullable: true })
  track_code?: string;

  @Field({ nullable: true })
  type?: string;

  @Field(() => Int, { nullable: true })
  views?: number;

  @Field({ nullable: true })
  ov_id?: string;

  @Field(() => Int, { nullable: true })
  can_edit?: number;

  @Field(() => Int, { nullable: true })
  can_attach_link?: number;

  @Field(() => Int, { nullable: true })
  is_private?: number;

  @Field({ nullable: true })
  platform?: string;

  @Field(() => Int, { nullable: true })
  local_views?: number;

  @Field(() => Int, { nullable: true })
  comments?: number;

  @Field(() => Int, { nullable: true })
  repeat?: number;

  @Field(() => Int, { nullable: true })
  processing?: number;

  @Field(() => Int, { nullable: true })
  live_start_time?: number;

  @Field(() => Int, { nullable: true })
  live_notify?: number;

  @Field(() => Int, { nullable: true })
  user_id?: number;

  @Field(() => Int, { nullable: true })
  content_restricted?: number;

  @Field({ nullable: true })
  content_restricted_message?: string;

  @Field(() => Int, { nullable: true })
  balance?: number;

  @Field(() => Int, { nullable: true })
  converting?: number;

  @Field(() => Int, { nullable: true })
  spectators?: number;

  @Field(() => Int, { nullable: true })
  is_subscribed?: number;

  @Field(() => Int, { nullable: true })
  attachment_export_id?: number;

  @Field(() => Int, { nullable: true })
  album_id?: number;

  @Field(() => VideoFile, { nullable: true })
  VideoFile?: VideoFile;
}
