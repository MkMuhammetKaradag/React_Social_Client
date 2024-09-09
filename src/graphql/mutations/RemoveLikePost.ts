import { gql } from '@apollo/client';

export const REMOVE_LIKE_POST = gql`
  mutation RemoveLikePost($postId: String!) {
    removeLikePost(postId: $postId) {
      success
    }
  }
`;
