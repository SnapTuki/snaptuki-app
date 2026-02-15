import { gql, TypedDocumentNode } from "@apollo/client";
import { Query } from "@/types/__generated__/graphql";

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