import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    getNotifications {
      _id
      message
      isRead
      contentType
      type
      sender {
        _id
        userName
        profilePhoto
      }
      content {
        ... on Comment {
          _id
          content
        }
        ... on Like {
          _id
          createdAt
        }
        ... on Post {
          _id
        }
        ... on User {
          _id
        }
      }
    }
  }
`;
