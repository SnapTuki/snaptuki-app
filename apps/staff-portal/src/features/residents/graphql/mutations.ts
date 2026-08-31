import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { Mutation } from "../../../lib/graphql/generated";


export const REGISTER_RESIDENT: TypedDocumentNode<Mutation> = gql`
  mutation RegisterResident($input: RegisterResidentInput!) {
    registerResident(input: $input) {
      mrn
    }
  }
`;


export const UPDATE_RESIDENT_IDENTITY: TypedDocumentNode<Mutation> = gql`
  mutation UpdateResidentIdentity($input: UpdateResidentIdentityInput!) {
    updateResidentIdentity(input: $input) {
      residentId
      firstName
      lastName
      gender
      birthDate
    }
  }
`;




export const UPDATE_TASK: TypedDocumentNode<Mutation> = gql`
  mutation UpdateTask($input: UpdateCareTaskInput!) {
    updateCareTask(input: $input) {
      id
    }
  }
`;

export const CREATE_ADHOC_TASK: TypedDocumentNode<Mutation>= gql`
  mutation CreateCareTaskFromResidentProfile($input: CreateCareTaskInput!) {
    createCareTask(input: $input) {
      id
      status
      priority
    }
  }
`;