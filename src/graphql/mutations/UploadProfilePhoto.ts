import { gql } from '@apollo/client';

export const UPLOAD_PROFILEPHOTO = gql`
  mutation UploadProfilePhoto($profilePhoto: String!) {
    uploadProfilePhoto(profilePhoto: $profilePhoto)
  }
`;
