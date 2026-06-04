import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { Mutation } from "../../../lib/graphql/generated";

export const AUTHENTICATE_USER: TypedDocumentNode<Mutation> = gql`
  mutation AuthenticateUser($email: String!, $password: String!) {
    authenticateUser(input: { email: $email, password: $password }) {
      token
      user {
        userId
        agencyId
      }
    }
  }
`;