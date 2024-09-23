import { gql } from '@apollo/client';

export const REJECT_FOLLOW_REQUEST = gql`
  mutation RejectFollowRequat($requestId: String!) {
    rejectFollowRequest(requestId: $requestId)
  }
`;
