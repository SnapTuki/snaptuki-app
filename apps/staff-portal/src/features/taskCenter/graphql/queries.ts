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
      status
      dueAt
      resident {
        firstName
        lastName
      }
      # Since Task connects to Caregiver via Visit in your schema:
      visit {
        caregiver {
          firstName
        }
      }
    }
  }
`;

