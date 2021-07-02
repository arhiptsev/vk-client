import { gql } from '@apollo/client';

export const CONVERSATIONS_QUERY = gql`
  query {
    conversations {
      export_id
      Peer {
        UserInfo {
          first_name
          last_name
        }
      }
      last_message_id
      Message {
        from_id
        text
      }
    }
  }
`;
