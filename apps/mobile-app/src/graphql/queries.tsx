import { gql, TypedDocumentNode } from "@apollo/client";
import { Query } from "../types/__generated__/graphql";
export const WHO_IS_ME: TypedDocumentNode<Query['me']> = gql`
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
      category_id
      category_name
      description
      servicetasks {
        id
        service_name
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
  query GetServiceCategoryById($categoryId: String!) {
    getServiceTasksByCategory(categoryId: $categoryId) {
      category_id
      category_name
      serviceTasks {
        task_id
        service_name
      }
    }
  }
`;
