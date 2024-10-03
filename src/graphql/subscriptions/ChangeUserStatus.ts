import { gql } from '@apollo/client';
export const CHANGE_USER_STATUS_SUBSCRIPTION = gql`
  subscription ChangeUserStatus($userId: String!) {
    changeUserStatus(userId: $userId) {
      userId
      status
    }
  }
`;
