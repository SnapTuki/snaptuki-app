import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { Query } from '../../../lib/graphql/generated';

export const GET_TASK_LIST:TypedDocumentNode<Query> = gql`
  query GetTaskList($search: String, $status: String, $residentId: String) {
    taskList(search: $search, status: $status, residentId: $residentId) {
      id
      title
      category
      priority
      description
      status
      dueAt
      resident {
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

