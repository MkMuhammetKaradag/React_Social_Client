import { gql } from '@apollo/client';
export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: String!) {
    getUserProfile(userId: $userId) {
      _id
      profilePhoto
      firstName
      lastName
      email
      profilePhoto
      createdAt
      isPrivate
      followersCount
      followingCount
      isFollowing
      restricted
    }
  }
`;
