import { Field, ID, InputType } from "type-graphql";
//import { CareTaskPriorityGraphQL } from "../enums/CareTaskPriorityGraphQL.ts";

@InputType()
export class CreateCareTaskInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  description!: string;

  @Field(() => ID)
  residentId!: string;

  @Field(() => ID, { nullable: true })
  caregiverId!: string | null;

  @Field(() => String)
  dueTime!: string;

  @Field(() => String)
  priority!: string;

  @Field(() => String)
  status!: string;
}