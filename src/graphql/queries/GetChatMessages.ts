import { gql } from '@apollo/client';

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessage($input: GetChatMessagesInput!) {
    getChatMessage(input: $input) {
      messages {
        _id
        content
        sender {
          _id
          userName
          profilePhoto
        }
      }
      totalMessages
      totalPages
      currentPage
    }
  }
`;
