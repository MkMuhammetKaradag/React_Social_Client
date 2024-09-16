import { gql } from '@apollo/client';
export const CREATE_MESSAGE_SUBSCRIPTION = gql`
  subscription CreateMessage($chatId: String!) {
    createMessageToChat(chatId: $chatId) {
      _id
      content
      sender {
        _id
        userName
        profilePhoto
      }
    }
  }
`;
