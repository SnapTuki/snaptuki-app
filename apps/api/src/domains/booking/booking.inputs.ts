import { InputType, Field, ID } from "type-graphql";
import { Booking } from "./booking.types";

@InputType()
export class NewBookingInput implements Partial<Booking> {
    @Field(() => ID)
    elderId: number;

    @Field(() => ID)
    familyMemberId?: number;

    @Field(() => ID)
    caregiverId: number;

    @Field(() => ID)
    serviceId: number;

    @Field(type => Date)
    startTime: Date;

    @Field(type => Date)
    endTime: Date;

    @Field(() => Number)
    totalPrice: number;

    @Field(type => String)
    notes: string;
}


@InputType()
export class UpdatedBookingScheduelInput implements Partial<NewBookingInput> {
    @Field(() => Date)
    startTime?: Date;

    @Field(() => Date)
    endTime?: Date;

    @Field(() => Number)
    totalPrice?: number;
}