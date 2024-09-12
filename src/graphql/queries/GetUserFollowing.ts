import { gql } from '@apollo/client';
export const GET_USER_FOLLOWING = gql`
  query GetUserFollowing($userId: String!) {
    getUserFollowing(userId: $userId) {
      profilePhoto
      _id
      firstName
      lastName
      isFollowing
    }
  }
`;
