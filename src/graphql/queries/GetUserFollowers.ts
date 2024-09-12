import { gql } from '@apollo/client';
export const GET_USER_FOLLOWERS = gql`
  query GetUserFollowers($userId: String!) {
    getUserFollowers(userId: $userId) {
      profilePhoto
      _id
      firstName
      lastName
      isFollowing
    }
  }
`;  
