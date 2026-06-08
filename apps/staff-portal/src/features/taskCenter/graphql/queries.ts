import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { Query } from '../../../lib/graphql/generated';

export const GET_ALL_TASKS:TypedDocumentNode<Query> = gql`
  query GetTodayTasks($todayDate: DateTime) {
    taskList(dueAt: $todayDate) {
      id
      title
      priority
      description
      status
      dueAt
      assignedResident {
        firstName
        lastName
      }
      assignedCaregiver{
        firstName
        lastName
      }

      checklist{
        id
        label
      }
     
    }
  }
`;

export const SEARCH_RESIDENTS:TypedDocumentNode<Query> = gql`
  query SearchResidents($search: String) {
    residentList(search: $search) {
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

