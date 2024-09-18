import { gql } from '@apollo/client';
export const VIDEO_CALL_STARTED  = gql`
  subscription videoCalStarted($userId: String!) {
    videoCallStarted(userId: $userId) {
      chatId
      participants
      userName
    }
  }
`;
