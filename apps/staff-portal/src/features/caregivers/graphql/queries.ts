import type { TypedDocumentNode } from "@apollo/client";
import type { Query } from "../../../lib/graphql/generated";
import {gql} from "@apollo/client";


export const GET_CAREGIVERS: TypedDocumentNode<Query> = gql`
  query CaregiverList{
    caregiverList{
      id
      firstName
      lastName
      email
      phone
      role
    }
  }
`;