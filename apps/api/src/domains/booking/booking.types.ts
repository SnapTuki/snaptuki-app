import { registerEnumType } from "type-graphql";
import { Field, ID, ObjectType, Int, Float } from "type-graphql";
import { CaregiverProfile, CaregiverProfileCard } from "../caregiver-profile/cg.types";
import { ElderProfile } from "../elder-profile/elder-profile.types";
import { ServiceTask } from "../care-service/care-service.types"; // Reusing ServiceTask type
import { GraphQLDateTime } from "graphql-scalars";
export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}


registerEnumType(BookingStatus, {
    name: "BookingStatus"
});


// --- Nested Types for Booking Details ---

@ObjectType()
export class CareTaskBookSummary {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    status: string; // e.g. ACTIVE, COMPLETED

    @Field(() => [CareTaskSummary])
    tasks: CareTaskSummary[];
}

@ObjectType()
export class CareTaskSummary {
    @Field(() => ID)
    id: number;

    @Field(()=>String)
    title: string;

    @Field(()=>String)
    status: string; // e.g. PENDING, DONE

    @Field(()=>String)
    isMandatory: boolean;
}

// --- Main Types ---

/**
 * Specialized type for the 'My Visits' schedule view.
 * Provides quick-access details for confirmed appointments.
 */
@ObjectType()
export class ConfirmedVisitCard {
    @Field(() => ID)
    id: number;

    @Field(() => BookingStatus)
    status: BookingStatus;

    @Field(() => GraphQLDateTime)
    startTime: Date;

    @Field(() => GraphQLDateTime)
    endTime: Date;

    @Field(() => Int)
    totalPrice: number;

    // Expanded Elder details for the visit list (Name, Address)
    @Field(() => ElderProfile)
    elder: ElderProfile;

}
/**
 * Lightweight type for list views (My Bookings screen)
 */
@ObjectType()
export class BookingCard {
    @Field(() => ID)
    id: number;

    @Field(() => BookingStatus)
    status: BookingStatus;

    @Field(() => GraphQLDateTime)
    startTime: Date;

    @Field(() => GraphQLDateTime)
    endTime: Date;

    @Field(() => Int)
    totalPrice: number;

    // Relations (Lightweight)
    @Field(() => CaregiverProfileCard)
    caregiver: CaregiverProfileCard;

    @Field(() => ServiceTask)
    careService: ServiceTask;

}

/**
 * Full detailed type for a specific booking screen
 */
@ObjectType()
export class Booking {
    @Field(() => ID)
    id: number;

    @Field(() => Int)
    elderId: number;

    @Field(() => Int)
    familyMemberId: number;

    @Field(() => Int)
    caregiverId: number;

    @Field(() => Int)
    careServiceId: number;  

    @Field(() => BookingStatus)
    status: BookingStatus;

    @Field(() => GraphQLDateTime)
    startTime: Date;

    @Field(() => GraphQLDateTime)
    endTime: Date;

    @Field(() => String, { nullable: true })
    notes?: string;

    @Field(() => Int)
    totalPrice: number;

    @Field(() => GraphQLDateTime)
    createdAt: Date;

    @Field(() => GraphQLDateTime)
    updatedAt: Date;

    // --- Expanded Relations for Details View ---

    @Field(() => CaregiverProfileCard)
    caregiver: CaregiverProfileCard; // Or full CaregiverProfile if needed

    @Field(() => ElderProfile)
    elder: ElderProfile;

    @Field(() => CareTaskBookSummary, { nullable: true })
    careTaskBook?: CareTaskBookSummary;
}


@ObjectType()
export class FamilyMemberSummary {
    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;
}

/**
 * Lightweight type for the "Pending Requests" list view.
 * Matches the fields requested in your requests/index.tsx query.
 */
@ObjectType()
export class PendingRequestCard {
    @Field(() => ID)
    id: number;

    @Field(() => BookingStatus)
    status: BookingStatus;

    @Field(() => GraphQLDateTime)
    startTime: Date;

    @Field(() => GraphQLDateTime)
    endTime: Date;

    @Field(() => Int)
    totalPrice: number;

    @Field(() => GraphQLDateTime)
    createdAt: Date;

    @Field(() => FamilyMemberSummary)
    familyMember: FamilyMemberSummary;

    @Field(() => ElderProfile)
    elder: ElderProfile;

    @Field(() => CareTaskBookSummary, { nullable: true })
    careTaskBook?: CareTaskBookSummary;
}