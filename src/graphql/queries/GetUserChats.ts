import { gql } from '@apollo/client';
export const GET_USER_CHATS = gql`
  query GetChats {
    getChats {
      _id
      participants {
        userName
        profilePhoto
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
