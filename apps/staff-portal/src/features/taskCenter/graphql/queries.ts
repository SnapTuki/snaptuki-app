import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { Query } from '../../../lib/graphql/generated';

export const GET_TODAY_CARE_TASKS:TypedDocumentNode<Query> = gql`
  query GetTodayCareTasks {
    todayCareTasks {
      id
      title
      priority
      status
      dueTime
    }
  }
`;

export const GET_TOMORROW_CARE_TASKS:TypedDocumentNode<Query> = gql`
  query GetTomorrowCareTasks {
    tomorrowCareTasks {
      id
      title
      priority
      status
      dueTime
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

