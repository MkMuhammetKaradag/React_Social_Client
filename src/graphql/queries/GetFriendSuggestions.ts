import { gql } from '@apollo/client';
export const GET_FRIEND_SUGGESTIONS = gql`
  query GetFriendSuggestions {
    getFriendSuggestions {
      _id
      firstName
      lastName
      userName
      profilePhoto
    }
  }
`;
