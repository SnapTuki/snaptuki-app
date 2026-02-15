import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class ActivateUserInput {
  @Field(() => ID)
  userId!: string;
}