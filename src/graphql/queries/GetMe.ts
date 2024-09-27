import { gql } from '@apollo/client';
export const GET_ME = gql`
  query GetMe {
    getMe {
      _id
      interests
      firstName
      lastName
      userName
      email
      isPrivate
      profilePhoto
    }
  }
`;
