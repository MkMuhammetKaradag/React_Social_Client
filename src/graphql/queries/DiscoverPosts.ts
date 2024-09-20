import { gql } from '@apollo/client';

export const DISCOVER_POSTS = gql`
  query discoverPost($page: Float!, $pageSize: Float!) {
    discoverPosts(input: { page: $page, pageSize: $pageSize }) {
      posts {
        _id
        score
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
