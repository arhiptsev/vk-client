import React from 'react';
import Waveform from 'react-audio-waveform';

import {
  AudioMessage as AudioMessageType,
  Video as VideoType,
} from '@graphql/types';

import { VideoContainer } from './styled';

export const Video = ({
  export_id,
  access_key,
  can_comment,
  can_like,
  can_repost,
  can_subscribe,
  can_add_to_faves,
  can_add,
  date,
  description,
  duration,
  width,
  height,
  id,
  owner_id,
  title,
  is_favorite,
  player,
  added,
  track_code,
  type,
  views,
  ov_id,
  can_edit,
  can_attach_link,
  is_private,
  platform,
  local_views,
  comments,
  repeat,
  processing,
  live_start_time,
  live_notify,
  user_id,
  content_restricted,
  content_restricted_message,
  balance,
  converting,
  spectators,
  is_subscribed,
  attachment_export_id,
  album_id,
  VideoFile,
}: VideoType) => {
  return (
    <VideoContainer>
      {/* <Video /> */}
    </VideoContainer>
  );
};
