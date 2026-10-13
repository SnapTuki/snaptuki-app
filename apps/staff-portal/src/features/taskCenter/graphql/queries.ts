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
      assignedToCaregiver {
        id
        firstName
        lastName
      }
      assignedToResident {
        firstName
        lastName
      }
    }
  }
`;

export const GET_CARE_TASK_DETAILS:TypedDocumentNode<Query> = gql`
  query GetCareTaskDetails($careTaskId: String!) {
    careTaskDetails(careTaskId: $careTaskId) {
      id
      title
      description
      priority
      status
      dueTime
      completionNote
      assignedToCaregiver {
        id
        firstName
        lastName
      }
      assignedToResident {
        residentId
        firstName
        lastName
      }
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
      assignedToCaregiver {
        id
        firstName
        lastName
      }
      assignedToResident {
        residentId
        firstName
        lastName
      } 
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

