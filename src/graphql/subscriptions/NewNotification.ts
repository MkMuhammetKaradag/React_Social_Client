import { gql } from '@apollo/client';
export const NEW_NOTIFICATION_SUBSCRIPTION = gql`
  subscription NewNotification {
    newNotification {
      _id
      sender {
        _id
        userName
        profilePhoto
      }
      isRead
      message
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
