import { gql } from '@apollo/client';

export const ACCEPT_FOLLOW_REQUEST = gql`
  mutation AcceptFollowRequest($requestId: String!) {
    acceptFollowRequest(requestId: $requestId)
  }
`;
