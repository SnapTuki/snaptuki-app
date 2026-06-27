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

/**
 * Replaces or updates the list of emergency contacts for a resident.
 * This aligns with the Aggregate Root pattern where the collection is managed as a whole.
 */
export const UPDATE_EMERGENCY_CONTACTS: TypedDocumentNode<Mutation> = gql`
  mutation UpdateEmergencyContacts($residentId: String!, $contacts: [EmergencyContactInput!]!) {
    updateEmergencyContacts(residentId: $residentId, contacts: $contacts) {
      residentId
      emergencyContacts{
        name
        relation
        phone
      }
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
  mutation CancelResidentTask($id: String!, $reason: String) {
    cancelTask(id: $id, reason: $reason) {
      id
      status
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

export const CREATE_ADHOC_TASK: TypedDocumentNode<Mutation>= gql`
  mutation CreateAdHocTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      status
      priority
    }
  }
`;