import { gql } from '@apollo/client';
export const JOIN_VIDEO_ROOM_TOKEN = gql`
  mutation JoinVideoRoom($chatId: String!) {
    joinVideoRoom(chatId: $chatId)
  }
`;
