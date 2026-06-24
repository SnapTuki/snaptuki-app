import { Field, InputType, ID } from 'type-graphql';
import { UserRole } from '../types/userAuthData';

@InputType()
export class AssignRoleInput {
  @Field(() => ID)
  userId!: string;

  @Field(() => UserRole)
  role!: UserRole;
}