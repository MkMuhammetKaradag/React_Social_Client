import { gql } from '@apollo/client';
export const GET_FOLLOWING_REQUEST = gql`
  query GetFollowingRequest {
    getFollowingRequests {
      _id
      status
      to {
        _id
        firstName
        userName
        lastName
        profilePhoto
      }
    }
  }
`;
