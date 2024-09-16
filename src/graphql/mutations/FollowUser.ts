import { gql } from '@apollo/client';

export const FOLLOW_USER = gql`
 mutation FollowUser($targetUserId:String!) {
  followUser(targetUserId: $targetUserId)
}
`;
