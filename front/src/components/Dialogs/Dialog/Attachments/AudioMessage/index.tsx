import React from 'react';
import Waveform from 'react-audio-waveform';
import ReactAudioPlayer from 'react-audio-player';

import { AudioMessageContainer } from './styled';

import { AudioMessage as AudioMessageType } from '@graphql/types';

export const AudioMessage = ({
  export_id,
  attachment_export_id,
  access_key,
  transcript_error,
  duration,
  id,
  link_mp3,
  link_ogg,
  owner_id,
  waveform,
  transcript_state,
  transcript,
  file,
  type,
}: AudioMessageType) => {
  return (
    <AudioMessageContainer>
      {/* <Waveform
        barWidth={4}
        peaks={waveform}
        // height={200}
        // pos={this.props.pos}
        duration={210}
        onClick={() => {}}
        color="#676767"
        progressGradientColors={[
          [0, '#888'],
          [1, '#aaa'],
        ]}
      /> */}

      <ReactAudioPlayer
        src={`http://localhost:4000/audios/${file}`}
        controls
      />
    </AudioMessageContainer>
  );
};
