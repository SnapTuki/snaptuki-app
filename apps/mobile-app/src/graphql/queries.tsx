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

