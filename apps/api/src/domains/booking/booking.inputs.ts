import { InputType, Field, Int, Float } from "type-graphql";

@InputType()
export class NewBookingInput {
    @Field(() => Int)
    elderId: number;

    @Field(() => Int, { nullable: true })
    familyMemberId?: number;

    @Field(() => Int)
    caregiverId: number;

    @Field(() => Int)
    serviceId: number;

    @Field(() => Date)
    startTime: Date;

    @Field(() => Date)
    endTime: Date;

    @Field(() => Float)
    totalPrice: number;

    @Field(() => String, { nullable: true })
    notes?: string;
}


@InputType()
export class UpdatedBookingScheduelInput {
    @Field(() => Date, { nullable: true })
    startTime?: Date;

    @Field(() => Date, { nullable: true })
    endTime?: Date;

    @Field(() => Float, { nullable: true })
    totalPrice?: number;
}