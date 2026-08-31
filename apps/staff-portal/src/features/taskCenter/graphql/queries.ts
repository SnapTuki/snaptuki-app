import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { Query } from '../../../lib/graphql/generated';

export const GET_ALL_TASKS:TypedDocumentNode<Query> = gql`
  query GetTodayCareTasks {
    todayCareTasks {
      id
      title
      priority
      status
    }
  }
`;

export const SEARCH_RESIDENTS:TypedDocumentNode<Query> = gql`
  query SearchResidents{
    residentList {
      residentId
      firstName
      lastName
    }
  }
`;

export const SEARCH_CAREGIVERS:TypedDocumentNode<Query> = gql`
  query SearchCaregivers($search: String) {
    caregiverList(search: $search) {
      id
      firstName
      lastName
    }
  }
`;

