import { gql } from '@apollo/client';

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      _id
      firstName
      lastName
      userName
      email
      isPrivate
      profilePhoto
    }
  }
`;
