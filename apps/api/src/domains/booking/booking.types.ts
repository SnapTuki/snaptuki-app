import { registerEnumType } from "type-graphql";
import { Field, ID, ObjectType } from "type-graphql";

export enum BookingStatus {
    PENDING = "PENDONG",
    CONFIRMED = "COMFIRMED",
    ACCEPTED = "ACCEPTED",
    CANCLED = "CANCLED",
    COMPLETED = "COMPLETED"
}

registerEnumType(BookingStatus, {
    name: "BookingStatus"
});


@ObjectType()
export class Booking {
    @Field(() => ID)
    id: number;

    @Field(() => ID)
    elderId: number;

    @Field(() => ID)
    familyMemberId: number;

    @Field(() => ID, { nullable: true })
    caregiverId: number;

    @Field(() => ID)
    serviceId: number;

    @Field(() => BookingStatus)
    status: BookingStatus;

    @Field(() => Date)
    startTime: Date;

    @Field(() => Date)
    endTime: Date;

    @Field(() => String,{ nullable: true })
    notes: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Number)
    totalPrice: number
}

