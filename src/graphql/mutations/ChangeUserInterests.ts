import { gql } from '@apollo/client';

export const CHANGE_USER_INTERESTS = gql`
  mutation ChangeUserInterests($input: ChangeUserInterestsInput!) {
    changeUserInterests(input: $input)
  }
`;
