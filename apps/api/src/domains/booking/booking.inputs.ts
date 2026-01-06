import { InputType, Field, ID } from "type-graphql";
import { Booking } from "./booking.types";

@InputType()
export class NewBookingInput implements Partial<Booking> {
    @Field(type => ID)
    elderId: string;

    familyMemberId?: string;

    @Field(type => ID)
    caregiverId: string;

    @Field(type => ID)
    serviceId: string;

    @Field(type => Date)
    startTime: Date;

    @Field(type => Date)
    endTime: Date;

    @Field(type => Number)
    totalPrice: Number;

    @Field(type => String)
    notes: string;
}


@InputType()
export class UpdatedBookingScheduelInput implements Partial<NewBookingInput> {
    @Field(type => Date)
    startTime?: Date;

    @Field(type => Date)
    endTime?: Date;

    @Field(type => Number)
    totalPrice?: Number;
}