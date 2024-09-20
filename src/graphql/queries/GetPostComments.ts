import { gql } from '@apollo/client';
export const GET_POST_COMMENTS = gql`
  query GetPostComments($input: GetPostCommentsInput!) {
    getPostComments(input: $input) {
      comments {
        _id
        content
        user {
          _id
          firstName
          lastName
          userName
          profilePhoto
        }
      }
      totalCount
    }
  }
`;
