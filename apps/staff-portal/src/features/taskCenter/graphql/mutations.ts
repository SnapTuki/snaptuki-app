import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { Mutation } from "../../../lib/graphql/generated";


export const CREATE_ADHOC_TASK: TypedDocumentNode<Mutation>= gql`
  mutation CreateAdHocTask($input: CreateTaskInput!) {
    createCareTask(input: $input) {
      id
    }
  }
`;

export const UPDATE_CARE_TASK: TypedDocumentNode<Mutation> = gql`
  mutation UpdateCareTask($input: UpdateTaskInput!) {
    updateCareTask(input: $input) {
      id
    }
  }
`;


export const COMPLETE_CARE_TASK: TypedDocumentNode<Mutation> = gql`
  mutation CompleteCareTask($input: CompleteTaskInputGql!) {
    completeCareTask(input: $input) {
      id
    }
  }
`;

export const CANCEL_CARE_TASK: TypedDocumentNode<Mutation> = gql`
  mutation CancelCareTask($id: String!, $reason: String) {
    cancelCareTask(id: $id, reason: $reason) {
      id
    }
  }
`;

