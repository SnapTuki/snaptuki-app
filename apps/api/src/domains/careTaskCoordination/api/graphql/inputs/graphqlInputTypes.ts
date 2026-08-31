import { Field, ID, InputType } from "type-graphql";
import { CareTaskPriorityGraphQL } from "../enums/CareTaskPriorityGraphQL";
import { GraphQLDateTime } from "graphql-scalars";
@InputType()
export class AssignCareTaskInput {
  @Field(() => ID)
  careTaskId!: string;

  @Field(() => ID)
  caregiverId!: string;
}


@InputType()
export class ChangeCareTaskPriorityInput {
  @Field(() => ID)
  careTaskId!: string;

  @Field(() => CareTaskPriorityGraphQL)
  newPriority!: CareTaskPriorityGraphQL;

}


@InputType()
export class RescheduleCareTaskInput {
  @Field(() => ID)
  careTaskId!: string;

  @Field(() => GraphQLDateTime)
  newDueTime!: Date;

}


@InputType()
export class CancelCareTaskInput {
  @Field(() => ID)
  careTaskId!: string;

}


@InputType()
export class CompleteCareTaskInput {
  @Field(() => ID)
  careTaskId!: string;

  @Field(() => String,{ nullable: true })
  completionNote?: string;
}