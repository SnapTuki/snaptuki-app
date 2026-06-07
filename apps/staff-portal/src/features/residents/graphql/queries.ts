import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { Query } from "../../../lib/graphql/generated";

export const GET_RESIDENTS: TypedDocumentNode<Query> = gql`
  query ResidentList($search: String) {
    residentList(search: $search) {
        residentId
        mrn
        firstName
        lastName
        birthDate
        gender
        mobilityLevel
        status
        room
        emergencyContacts{
          id
          name
          relation
          phone
        }
    }
  }
`;

export const GET_RESIDENT_SUGGESTIONS: TypedDocumentNode<Query> = gql`
  query ResidentSuggestions($search: String) {
    residentList(search: $search) {
        residentId
        mrn
        firstName
        lastName
    }
  }
`;

export const GET_RESIDENT_BY_ID: TypedDocumentNode<Query> = gql`
  query GetResidentById($residentId: String!) {
    getResidentById(residentId: $residentId) {
      residentId
      mrn
      firstName
      lastName
     
    }
  }
`;

// --- QUERIES ---
export const GET_TASK_LIST: TypedDocumentNode<Query> = gql`
  query GetTaskListResident($residentId: String, $startDate: DateTime, $endDate: DateTime, $status: String) {
    taskList(residentId: $residentId, startDate: $startDate, endDate: $endDate, status: $status) {
      id
      title
      description
      status
      priority
      dueAt
      assignedCaregiver {
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

export const SEARCH_CAREGIVERS: TypedDocumentNode<Query> = gql`
  query SearchCaregivers($search: String) {
    caregiverList(search: $search) {
      id
      firstName
      lastName
    }
  }
`;

export const GET_RESIDENT_IDENTITY_PROFILE: TypedDocumentNode<Query> = gql`
query GetResidentIdentityProfile($residentId: String!) {

  getResidentById(residentId: $residentId){
    residentId
    mrn
    firstName
    lastName
    room
    gender
    birthDate
    emergencyContacts{
      id
      name
      phone
      relation
    }
    mobilityLevel
}
}
`
