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