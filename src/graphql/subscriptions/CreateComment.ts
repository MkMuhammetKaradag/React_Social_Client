import { gql } from '@apollo/client';
export const CREATE_COMMENT_SUBSCRIPTION = gql`
  subscription CreateCommentPost($postId: String!) {
    createCommentPost(postId: $postId) {
      _id
      content
      user {
        _id
        firstName
        lastName
        profilePhoto
      }
    }
  }
`;
