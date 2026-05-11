import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { Mutation } from "../../../lib/graphql/generated";


export const CREATE_ADHOC_TASK: TypedDocumentNode<Mutation>= gql`
  mutation CreateAdHocTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      status
      priority
    }
  }
`;

export const UPDATE_TASK: TypedDocumentNode<Mutation> = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
    }
  }
`;


export const COMPLETE_TASK_MUTATION: TypedDocumentNode<Mutation> = gql`
  mutation CompleteTask($input: CompleteTaskInputGql!) {
    completeTask(input: $input) {
      id
      status
    }
  }
`;

export const CANCEL_TASK_MUTATION: TypedDocumentNode<Mutation> = gql`
  mutation CancelTask($id: String!, $reason: String) {
    cancelTask(id: $id, reason: $reason) {
      id
      status
    }
  }
`;
