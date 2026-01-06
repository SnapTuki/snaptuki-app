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
    id: string;

    @Field(() => ID)
    elderId: string;

    @Field(() => ID)
    familyMemberId: string;

    @Field(() => ID, { nullable: true })
    caregiverId: string;

    @Field(() => ID)
    serviceId: string;

    @Field(() => BookingStatus)
    status: BookingStatus;

    @Field()
    startTime: Date;

    @Field()
    endTime: Date;

    @Field({ nullable: true })
    notes: string;

    @Field()
    createdAt: Date;

    @Field(type => Number)
    totalPrice: Number
}

