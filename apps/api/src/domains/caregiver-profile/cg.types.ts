import { Field, ID, ObjectType, registerEnumType, Float, Int } from "type-graphql";
import {
    Availability,
    BackgroundCheckStatus,
    Gender
} from "../../generated/prisma";
import { GraphQLDateTime } from "graphql-scalars";
import { ServiceTask } from "../care-service/care-service.types";
/* ---------------- ENUMS ---------------- */

registerEnumType(Availability, {
    name: "Availability",
    description: "Current availability status of the caregiver",
});

registerEnumType(BackgroundCheckStatus, {
    name: "BackgroundCheckStatus",
    description: "Status of the caregiver's background check",
});

registerEnumType(Gender, {
    name: "Gender",
    description: "Gender of the caregiver",
});

/* ---------------- NESTED TYPES ---------------- */

@ObjectType()
export class CaregiverEducation {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    degree: string;

    @Field(() => String)
    institution: string;

    @Field(() => Int)
    graduationYear: number;
}

@ObjectType()
export class CaregiverExperience {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    role: string;

    @Field(() => String, { nullable: true })
    organization?: string;

    @Field(() => Int)
    startYear: number;

    @Field(() => Int, { nullable: true })
    endYear?: number;

    @Field(() => String, { nullable: true })
    description?: string;
}

@ObjectType()
export class Skill {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    title: string;

    @Field(() => String, { nullable: true })
    description?: string;
}


@ObjectType()
export class Review {
    @Field(() => ID)
    id: number;

    @Field(() => Int)
    rating: number;

    @Field(() => String, { nullable: true })
    comment?: string;

    @Field(() => GraphQLDateTime)
    createdAt: Date;

    // Note: You might want to resolve the reviewer name here
    @Field(() => String, { nullable: true })
    reviewerName?: string;
}

/* ---------------- MAIN TYPES ---------------- */

/**
 * Lightweight type for list views (Search results, Featured lists)
 * Excludes heavy nested arrays like experience, education history, etc.
 */
@ObjectType()
export class CaregiverProfileCard {
    @Field(() => ID)
    id: number;

    @Field(() => Int)
    userId: number;

    @Field(() => String)
    firstName: string; // Resolved from User relation

    @Field(() => String)
    lastName: string;  // Resolved from User relation

    @Field(() => String, { nullable: true })
    profilePhotoUrl?: string;

    @Field(() => String, { nullable: true })
    city?: string;

    @Field(() => Float, { nullable: true })
    hourlyRate?: number;

    @Field(() => Float)
    rating: number;

    @Field(() => Int)
    completedJobsCount: number;

    @Field(() => Availability)
    availabilityStatus: Availability;

    @Field(() => String, { nullable: true })
    bio?: string; // Short preview

    // Useful for filtering in UI
    @Field(() => [String], { nullable: true })
    languages?: string[];

    @Field(() => Boolean)
    verified: boolean;
}

/**
 * Full Detailed Profile for the Profile Screen
 * Includes everything: Education, Experience, Full Service List, Reviews
 */
@ObjectType()
export class CaregiverProfile extends CaregiverProfileCard {
    @Field(() => String, { nullable: true })
    phoneNumber?: string; // Only shown if booking confirmed or for admin?

    @Field(() => GraphQLDateTime, { nullable: true })
    dateOfBirth?: Date;

    @Field(() => Gender, { nullable: true })
    gender?: Gender;

    @Field(() => String, { nullable: true })
    address?: string;

    @Field(() => String, { nullable: true })
    country?: string;

    @Field(() => BackgroundCheckStatus)
    backgroundCheckStatus: BackgroundCheckStatus;

    @Field(() => GraphQLDateTime)
    createdAt: Date;

    // --- Nested Relations ---

    @Field(() => [CaregiverEducation])
    education: CaregiverEducation[];

    @Field(() => [CaregiverExperience])
    experience: CaregiverExperience[];

    @Field(() => [Skill])
    skills: Skill[];

    @Field(() => [ServiceTask])
    offeredServices: ServiceTask[];

    @Field(() => [Review])
    reviews: Review[];
}