import { gql } from '@apollo/client';

export const GET_POSTS_I_LIKED = gql`
  query GetPostsIliked {
    getPostsILiked {
      _id
      commentCount
      likeCount
      firstMedia {
        url
        publicId
        type
      }
    }
  }
`;
