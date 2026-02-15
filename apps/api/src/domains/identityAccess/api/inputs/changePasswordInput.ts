import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class ChangePasswordInput {
  @Field(() => ID)
  userId!: string;

  @Field(() => String)
  newPassword!: string;
}