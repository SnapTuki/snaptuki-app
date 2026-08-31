import { GraphQLDateTime } from "graphql-scalars";
import {ID, Field, InputType } from "type-graphql";

@InputType()
export class UpdateCareTaskInput {

    @Field(() => ID)
    id!: string;

    @Field(() => String)
    title!: string;

    @Field(() => String)
    description!: string;

    @Field(() => String)
    caregiverId!: string;

    @Field(() => String)
    status!: string;

    @Field(() => String)
    priority!: string;

    @Field(() => GraphQLDateTime)
    dueTime!: Date;
}

