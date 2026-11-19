import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { Mutation } from "../../../lib/graphql/generated";


export const CREATE_ADHOC_TASK: TypedDocumentNode<Mutation>= gql`
  mutation CreateAdHocTask($input: CreateCareTaskInput!) {
    createCareTask(input: $input) {
      id
    }
  }
`;

export const UPDATE_CARE_TASK: TypedDocumentNode<Mutation> = gql`
  mutation UpdateCareTask($input: UpdateCareTaskInput!) {
    updateCareTask(input: $input) {
      id
    }
  }
`;


export const COMPLETE_CARE_TASK: TypedDocumentNode<Mutation> = gql`
  mutation CompleteCareTask($input: CompleteCareTaskInput!) {
    completeCareTask(input: $input) {
      id
    }
  }
`;

export const CANCEL_CARE_TASK: TypedDocumentNode<Mutation> = gql`
  mutation CancelCareTask($input: CancelCareTaskInput!) {
    cancelCareTask(input: $input) {
      id
    }
  }
`;

