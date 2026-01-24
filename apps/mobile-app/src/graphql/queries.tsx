import { gql, TypedDocumentNode } from "@apollo/client";
import { Query } from "../types/__generated__/graphql";
export const WHO_IS_ME: TypedDocumentNode<Query> = gql`
query WhoIsMe {
    me {
        id
        role
    }
}
`


export const GET_ALL_CARE_SERVICES: TypedDocumentNode<Query> = gql`
  query GetAllCareServices {
    getAllServiceCategories {
      categoryId
      categoryName
      serviceTasks {
        serviceId
        serviceName
      }
    }
  }
`;

import {
    QueryGetServiceTasksByCategoryArgs,
} from "../types/__generated__/graphql";

export const GET_CARE_SERVICE_BY_CATEGORY: TypedDocumentNode<
    Query,
    QueryGetServiceTasksByCategoryArgs
> = gql`
  query GetServiceCategoryById($categoryId: ID!) {
    getServiceTasksByCategory(categoryId: $categoryId) {
      serviceId
      serviceName
    }
  }
`;

/**
 * Gets all elders associated with the currently logged-in family member.
 * This corresponds to the `listMyElders` resolver in backend.
 */
export const GET_MY_ELDERS: TypedDocumentNode<Query> = gql`
  query GetMyElders {
    listMyElders {
        id
        firstName
        lastName
        dateOfBirth
        mobilityLevel
    }
  }
`;

/**
 * Gets a single elder profile by ID.
 * Useful for detailed views or editing screens.
 */
export const GET_ELDER_PROFILE: TypedDocumentNode<
    Query,
    { elderId: number }
> = gql`
  query GetElderProfile($elderId: Int!) {
    getElderProfile(elderId: $elderId) {
      id
      firstName
      lastName
      dateOfBirth
      mobilityLevel
      address
      city
      country
      phone
      medicalNotes
    }
  }
`;