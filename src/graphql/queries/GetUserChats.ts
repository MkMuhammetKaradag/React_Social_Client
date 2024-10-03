import { gql } from '@apollo/client';
export const GET_USER_CHATS = gql`
  query GetChats {
    getChats {
      _id
      participants {
        _id
        userName
        profilePhoto
        status
      }
      lastMessage {
        content
        sender {
          _id
        }
      }
    }
  }
`;
