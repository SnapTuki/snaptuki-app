import { gql, TypedDocumentNode } from "@apollo/client";
import { Query } from "../types/__generated__/graphql";

export const GET_PENDING_BOOKINGS: TypedDocumentNode<Query> = gql` 
 query GetPendingCaregiverBookings {
  # Calls the new specialized resolver
  pendingBookings {
    id
    status
    startTime
    endTime
    totalPrice
    createdAt
    
    # Information about the family making the request
    familyMember {
        firstName
        lastName
    }

    # Context about the elder and their location
    elder {
      id
      firstName
      lastName
      address 
    }

    # The specific care plan requested
    careTaskBook {
      tasks {
        id
        title
        isMandatory
      }
    }
  }
}
`;