import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { Mutation } from "../../../lib/graphql/generated";

export const REGISTER_CAREGIVER: TypedDocumentNode<Mutation> = gql`
  mutation RegisterCaregiver($input: RegisterCaregiverInputGql!) {
    registerCaregiver(input: $input) {
      id
    }
  }
`;