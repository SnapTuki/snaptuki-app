import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { Query } from "../../../lib/graphql/generated";

export const GET_RESIDENTS: TypedDocumentNode<Query> = gql`
  query ResidentList($search: String) {
    residentList(search: $search) {
      mrn
      firstName
      lastName
      birthDate
      gender
      mobilityLevel
      room
    }
  }
`;