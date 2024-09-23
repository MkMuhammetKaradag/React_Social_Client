import { gql } from '@apollo/client';
export const GET_FOLLOW_REQUEST = gql`
  query GetFollowRequest {
    getFollowRequests {
      _id
      status
      from {
        _id
        firstName
        userName
        lastName
        profilePhoto
      }
    }
  }
`;
