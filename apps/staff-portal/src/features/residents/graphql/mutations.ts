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