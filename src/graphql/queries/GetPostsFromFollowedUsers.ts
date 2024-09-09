import { gql } from '@apollo/client';
export const GET_HOMA_PAGE_POSTS = gql`
  query GetPostsFromFollowedUsers($input: GetPostsFromFollowedUsersInput!) {
    getPostsFromFollowedUsers(input: $input) {
      _id
      isLiked
      user {
        _id
        firstName
        lastName
        profilePhoto
      }
      media {
        url
        type
        publicId
      }
      commentCount
      likeCount
      title
    }
  }
`;
