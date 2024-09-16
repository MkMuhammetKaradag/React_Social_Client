import { gql } from '@apollo/client';

export const UN_FOLLOW_USER = gql`
  mutation UnFollowUser($targetUserId: String!) {
    unFollowUser(targetUserId: $targetUserId)
  }
`;
