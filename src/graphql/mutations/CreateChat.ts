import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation CreateChat($participantIds: [String!]!) {
    createChat(participantIds: $participantIds) {
      _id
    }
  }
`;
