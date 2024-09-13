import { gql } from '@apollo/client';
export const GET_SEARCH_USERS = gql`
  query GerSearchForUser($input: GetSearchForUserInput!) {
    getSearchForUser(input: $input) {
      users {
        _id
        userName
        profilePhoto
        followingCount
      }
      totalCount
    }
  }
`;
