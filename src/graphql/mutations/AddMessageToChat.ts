import { gql } from '@apollo/client';

export const ADD_MESSAGE_TO_CHAT = gql`
  mutation AddMessageToChat($input: AddMessageToChatInput!) {
    addMessageToChat(input: $input) {
      _id
    }
  }
`;
