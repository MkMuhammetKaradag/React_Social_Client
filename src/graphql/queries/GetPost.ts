import { gql } from '@apollo/client';
export const GET_POST = gql`
  query GetPost($postId: String!) {
    getPost(postId: $postId) {
      _id
      title
      tags
      createdAt
      commentCount
      isLiked
      likeCount
      user {
        _id
        firstName
        lastName
        profilePhoto
      }
      media {
        url
        publicId
        type
      }
    }
  }
`;
