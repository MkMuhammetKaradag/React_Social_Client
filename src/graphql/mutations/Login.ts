import { gql } from '@apollo/client';
export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      user {
        _id
        email
        firstName
        lastName
        profilePhoto
      }
    }
  }
`;
