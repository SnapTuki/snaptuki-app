import { InputType, Field, Int, Float } from "type-graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { CareTaskStatus } from "../care-task-book/ctb-types";
@InputType()
export class NewBookingInput {
    @Field(() => Int)
    elderId: number;

    @Field(() => Int)
    familyMemberId: number;

    @Field(() => Int)
    caregiverId: number;

    @Field(() => [CareTaskInput])
    tasks: CareTaskInput[];

    @Field(() => GraphQLDateTime)
    startTime: Date;

    @Field(() => GraphQLDateTime)
    endTime: Date;

    @Field(() => Float)
    totalPrice: number;

    @Field(() => String, { nullable: true })
    notes?: string;
}


@InputType()
export class UpdatedBookingScheduelInput {
    @Field(() => GraphQLDateTime, { nullable: true })
    startTime?: Date;

    @Field(() => GraphQLDateTime, { nullable: true })
    endTime?: Date;

    @Field(() => Float, { nullable: true })
    totalPrice?: number;
}


@InputType()
export class CareTaskInput {
    @Field(() => String)
    title: string;

    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => Int, {nullable: true})
    taskOrder?: number;

    @Field(() => CareTaskStatus)
    status: CareTaskStatus

    @Field(() => Boolean, { defaultValue: true })
    isMandatory: boolean;
}