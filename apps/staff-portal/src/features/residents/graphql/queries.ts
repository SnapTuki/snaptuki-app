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

export const GET_RESIDENT_BY_ID: TypedDocumentNode<Query> = gql`
  query GetResidentById($residentId: String!) {
    getResidentById(residentId: $residentId) {
      residentId
      mrn
      firstName
      lastName
      birthDate
      gender
      status
      room
      mobilityLevel
      createdAt
      
      # 1. Clinical Data
      allergies {
        id
        name
        reaction
        severity
      }
      
      medications {
        id
        name
        dosage
        frequency
        startDate
        endDate
      }
      
      emergencyContacts {
        id
        name
        relation
        phone
        isPrimary
      }

      # 2. Care Plan (The "Rules")
      taskAssignments {
        id
        isActive
        taskTemplate {
          id
          name
          category
          priority
        }
      }

      # 3. Care History (The "Results" from the Unified Task Table)
      tasks {
        id
        status
        priority
        category
        dueAt
        completedAt
        completionNotes
        # Include checklist items for the audit trail
        checklist {
          id
          label
          isCompleted
          completedAt
        }
        # Include specific clinical readings (BP, Glucose, etc)
        actionRecords {
          id
          value
          notes
          createdAt
          
        }
      }
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
