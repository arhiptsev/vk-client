import { gql } from '@apollo/client';

export const MESSAGES_QUERY = gql`
  query messages($conversation_id: Float!, $skip: Float!) {
    messages(conversation_id: $conversation_id, skip: $skip) {
      export_id
      out
      text
      Attachment {
        export_id
        type
        media {
          ... on AudioMessage {
            export_id
            attachment_export_id
            access_key
            transcript_error
            duration
            id
            link_mp3
            link_ogg
            owner_id
            waveform
            transcript_state
            transcript
            file
            type
          }

          ... on Photo {
            export_id
            album_id
            date
            id
            owner_id
            has_tags
            lat
            long
            access_key
            text
            user_id
            post_id
            attachment_export_id
            photo_256
            place
            type
            PhotoSize {
              file
            }
          }
        }
      }
    }
  }
`;
