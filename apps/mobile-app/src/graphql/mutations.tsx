import { gql, TypedDocumentNode } from "@apollo/client";
import { Mutation, MutationLoginArgs } from "../types/__generated__/graphql";


export const LOGIN: TypedDocumentNode<{login: Mutation['login']}, MutationLoginArgs> = gql`
mutation Login($credentials: LoginCredentials!){
    login(credentials: $credentials){
        user{
            id
            role
        }
        token
    }
}

`
