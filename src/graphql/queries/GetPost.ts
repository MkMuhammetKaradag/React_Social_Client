import { gql } from '@apollo/client';
export const GET_POST = gql`
  query GetPost($postId: String!) {
    getPost(postId: $postId) {
      _id
      title
      tags
      createdAt
      commentCount
      likeCount
      user {
        _id
        firstName
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
