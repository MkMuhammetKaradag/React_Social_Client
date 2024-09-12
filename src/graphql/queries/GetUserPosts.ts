import { gql } from '@apollo/client';

export const GET_USER_POSTS = gql`
  query GetUserPosts($input: GetUserPostsInput!) {
    getUserPosts(input: $input) {
      posts {
        _id
        commentCount
        likeCount
        firstMedia {
          url
          publicId
          type
        }
      }
      totalCount
    }
  }
`;
