import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { Query } from "../../../lib/graphql/generated";


export const CREATE_ADHOC_TASK: TypedDocumentNode<Query>= gql`
  mutation CreateAdHocTask($input: AssignTaskInputGql!) {
    assignTask(input: $input) {
      id
      status
      priority
    }
  }
`;