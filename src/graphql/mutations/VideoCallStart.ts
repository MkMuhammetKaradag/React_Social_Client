import { gql } from '@apollo/client';

export const START_VIDEO_CALL = gql`
  mutation startVideoCall($chatId: String!) {
    startVideoCall(chatId: $chatId)
  }
`;
