import { gql, DocumentNode } from '@apollo/client';

export const RESET_PASSWORD: DocumentNode = gql`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      _id
      firstName
      email
    }
  }
`;
