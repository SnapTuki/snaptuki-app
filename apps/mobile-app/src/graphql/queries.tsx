import { gql, TypedDocumentNode } from "@apollo/client";
import { BookingStatus, Query } from "../types/__generated__/graphql";
export const WHO_IS_ME: TypedDocumentNode<Query> = gql`
query WhoIsMe {
    me {
        id
        role
    }
}
`


export const GET_ALL_CARE_SERVICES: TypedDocumentNode<Query> = gql`
  query GetAllCareServices {
    getAllServiceCategories {
      categoryId
      categoryName
      serviceTasks {
        serviceId
        serviceName
      }
    }
  }
`;

import {
  QueryGetServiceTasksByCategoryArgs,
} from "../types/__generated__/graphql";

export const GET_CARE_SERVICE_BY_CATEGORY: TypedDocumentNode<
  Query,
  QueryGetServiceTasksByCategoryArgs
> = gql`
  query GetServiceCategoryById($categoryId: ID!) {
    getServiceTasksByCategory(categoryId: $categoryId) {
      serviceId
      serviceName
    }
  }
`;

/**
 * Gets all elders associated with the currently logged-in family member.
 * This corresponds to the `listMyElders` resolver in backend.
 */
export const GET_MY_ELDERS: TypedDocumentNode<Query> = gql`
  query GetMyElders {
    listMyElders {
        id
        firstName
        lastName
        dateOfBirth
        mobilityLevel
    }
  }
`;

/**
 * Gets a single elder profile by ID.
 * Useful for detailed views or editing screens.
 */
export const GET_ELDER_PROFILE: TypedDocumentNode<
  Query,
  { elderId: number }
> = gql`
  query GetElderProfile($elderId: Int!) {
    getElderProfile(elderId: $elderId) {
      id
      firstName
      lastName
      dateOfBirth
      mobilityLevel
      address
      city
      country
      phone
      medicalNotes
    }
  }
`;


// --- Caregiver Queries ---

/**
 * Fetches a list of caregiver cards.
 * Used for: Directory, Search Results, Recommendations
 */
export const GET_CAREGIVER_CARDS: TypedDocumentNode<
  Query,
  { city?: string, verified?: Boolean, offeredServiceIds?: number[]}
> = gql`
  query ListCaregivers($city: String, $verified: Boolean, $offeredServiceIds: [Int!]) {
    listCaregivers(city: $city, verified: $verified, offeredServiceIds: $offeredServiceIds) {
      id
      userId
      profilePhotoUrl
      firstName
      lastName
      city
      hourlyRate
      rating
      completedJobsCount
      availabilityStatus
      bio
      languages
      verified
    }
  }
`;

/**
 * Fetches the full detailed profile of a specific caregiver.
 * Used for: Caregiver Detail Screen
 */
export const GET_CAREGIVER_PROFILE: TypedDocumentNode<
  Query,
  { profileId: number }
> = gql`
  query GetCaregiverProfile($profileId: Int!) {
    getCaregiver(profileId: $profileId) {
      # Basic Card Info
      id
      userId
      firstName
      lastName
      profilePhotoUrl
      city
      hourlyRate
      rating
      completedJobsCount
      availabilityStatus
      bio
      languages
      verified

      # Detailed Info
      phoneNumber
      dateOfBirth
      gender

      # Nested Relations
      education {
        id
        degree
        institution
        graduationYear
      }

      experience {
        id
        role
        organization
        startYear
        endYear
        description
      }

      skills {
        id
        title
      }

      offeredServices {
        serviceId
        serviceName
      }

      reviews {
        id
        rating
        comment
        createdAt
        reviewerName
      }
    }
  }
`;

export const GET_MY_PROFILE: TypedDocumentNode<Query> = gql`
  query GetMyProfile {
    me {
      firstName
      lastName
      email
      role
      familyMemberProfile {
        id
        dateOfBirth
        address
        postalCode
        city
        country
      }
    }
  }
`;

// --- Booking Queries ---

export const GET_BOOKING_CARDS: TypedDocumentNode<Query, {filter?: BookingStatus}> = gql`
  query GetMyBookings($filter: BookingStatus) {
    myBookings(filter: $filter) {
      id
      status
      startTime
      endTime
      totalPrice
    }
  }
`;

export const GET_BOOKING_DETAILS: TypedDocumentNode<
  Query,
  { bookingId: number }
> = gql`
  query GetBookingDetails($bookingId: Int!) {
    getBooking(bookingId: $bookingId) {
      id
      status
      startTime
      endTime
      totalPrice
      notes
      caregiver {
        firstName
        profilePhotoUrl
      }
      elder {
        firstName
        lastName
        address
      }
      careTaskBook {
        status
        tasks {
          id
          title
          status
          isMandatory
        }
      }
    }
  }
`;