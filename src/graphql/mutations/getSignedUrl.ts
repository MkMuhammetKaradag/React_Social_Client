import { gql } from '@apollo/client';

export const GET_SIGNED_URL = gql`
  mutation GetSignedUploadUrl($input: SignUrlInput!) {
    getSignedUploadUrl(input: $input) {
      signature
      timestamp
      cloudName
      apiKey
    }
  }
`;
