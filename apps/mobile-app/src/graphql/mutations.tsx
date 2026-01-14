import { gql, TypedDocumentNode } from "@apollo/client";
import { Mutation, MutationCompleteRegisterationArgs, MutationLoginArgs, MutationRequestRegisterationOtpArgs, MutationVerifyEmailArgs, VerifyEmailInput } from "../types/__generated__/graphql";


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

export const REQUEST_REGISTERATION_OTP: 
TypedDocumentNode<{requestRegisterationOtp: Mutation['requestRegisterationOtp']}, MutationRequestRegisterationOtpArgs> = gql`
mutation RequestRegisterationOtp($email: String!){
    requestRegisterationOtp(email: $email){
        email
        otpCode
        msg
        success
    }
}
`


export const VERIFY_EMAIL: TypedDocumentNode<{verifyEmail: Mutation['verifyEmail']}, MutationVerifyEmailArgs> = gql`
mutation VerifyEmail($data: VerifyEmailInput!){
    verifyEmail(data: $data)
}
`

export const COMPLETE_REGISTERATION: TypedDocumentNode<{
    completeRegisteration: Mutation['completeRegisteration']}, MutationCompleteRegisterationArgs> = gql`
    mutation CompleteRegisteration($data: CompleteRegisterationInput!){
        completeRegisteration(data: $data){
            token
            user{
                id
                email
                role
                firstName
                lastName
            }
        }
    }  
`
