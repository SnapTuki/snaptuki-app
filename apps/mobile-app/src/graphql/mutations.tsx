import { gql, TypedDocumentNode } from "@apollo/client";
import {
    Mutation,
    MutationCompleteRegisterationArgs,
    MutationLoginArgs,
    MutationRequestRegisterationOtpArgs,
    MutationVerifyEmailArgs,
    VerifyEmailInput,
    // Imported Args for Elder Profile operations
    MutationCreateElderProfileArgs,
    MutationUpdateElderProfileArgs,
    MutationRemoveElderProfileArgs
} from "../types/__generated__/graphql";


export const LOGIN: TypedDocumentNode<{ login: Mutation['login'] }, MutationLoginArgs> = gql`
mutation Login($credentials: LoginCredentials!){
    login(credentials: $credentials){
        user{
            id
            role
            firstName
            lastName
            email
        }
        token
    }
}

`

export const REQUEST_REGISTERATION_OTP:
    TypedDocumentNode<{ requestRegisterationOtp: Mutation['requestRegisterationOtp'] }, MutationRequestRegisterationOtpArgs> = gql`
mutation RequestRegisterationOtp($email: String!){
    requestRegisterationOtp(email: $email){
        email
        otpCode
        msg
        success
    }
}
`


export const VERIFY_EMAIL: TypedDocumentNode<{ verifyEmail: Mutation['verifyEmail'] }, MutationVerifyEmailArgs> = gql`
mutation VerifyEmail($data: VerifyEmailInput!){
    verifyEmail(data: $data)
}
`

export const COMPLETE_REGISTERATION: TypedDocumentNode<{
    completeRegisteration: Mutation['completeRegisteration']
}, MutationCompleteRegisterationArgs> = gql`
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

// --- Elder Profile Mutations ---

export const CREATE_ELDER_PROFILE: TypedDocumentNode<Mutation, MutationCreateElderProfileArgs> = gql`
    mutation CreateElderProfile($input: CreateElderProfileInput!) {
        createElderProfile(input: $input) {
            id
            firstName
            lastName
            dateOfBirth
            mobilityLevel
            address
            city
        }
    }
`

export const UPDATE_ELDER_PROFILE: TypedDocumentNode<Mutation, MutationUpdateElderProfileArgs> = gql`
    mutation UpdateElderProfile($elderId: Int!, $input: UpdateElderProfileInput!) {
        updateElderProfile(elderId: $elderId, input: $input) {
            id
        }
    }
`

export const REMOVE_ELDER_PROFILE: TypedDocumentNode<Mutation, MutationRemoveElderProfileArgs> = gql`
    mutation RemoveElderProfile($elderId: Int!) {
        removeElderProfile(elderId: $elderId)
    }
`

export const UPDATE_FAMILY_PROFILE: TypedDocumentNode<Mutation, any> = gql`
    mutation UpdateFamilyMemberProfile($input: UpdateFamilyMemberProfileInput!) {
        updateFamilyMemberProfile(input: $input) {
            id
            phoneNumber
            address
            city
            postalCode
            country
        }
    }
`

// --- Booking Mutations ---

export const CREATE_BOOKING: TypedDocumentNode<Mutation, any> = gql`
    mutation CreateBooking($input: NewBookingInput!) {
        createBooking(input: $input) {
            id
            status
            startTime
            endTime
            totalPrice
        }
    }
`

export const RESCHEDULE_BOOKING: TypedDocumentNode<Mutation, any> = gql`
    mutation RescheduleBooking($bookingId: Int!, $input: UpdatedBookingScheduelInput!) {
        rescheduleBooking(bookingId: $bookingId, input: $input) {
            id
            status
        }
    }`


export const CANCEL_BOOKING = gql`
  mutation CancelBooking($bookingId: Int!) {
    cancelBooking(bookingId: $bookingId) {
      id
      status
      updatedAt
    }
  }
`;