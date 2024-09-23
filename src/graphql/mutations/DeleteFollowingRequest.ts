import { gql } from '@apollo/client';

export const DELETE_FOLLOWING_REQUEST = gql`
 mutation DeleteFollowingRequest($requestId:String!) {
  deleteFollowingRequests(requestId: $requestId)
}
`;
