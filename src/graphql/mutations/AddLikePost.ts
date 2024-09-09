import { gql } from '@apollo/client';

export const ADD_LIKE_POST = gql`
  mutation AddLikePost($postId: String!) {
    addLikePost(postId: $postId)
  }
`;
