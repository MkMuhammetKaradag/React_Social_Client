import { gql } from '@apollo/client';
export const ACTIVATION_USER = gql`
  mutation ActivateUser($input:  ActivationUserInput!) {
    activationUser(input: $input) {
     _id
    firstName
    lastName
    roles
    profilePhoto
    email
    }
  }
`;
