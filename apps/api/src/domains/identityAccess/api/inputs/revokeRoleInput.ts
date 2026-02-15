import { Field, InputType, ID } from 'type-graphql';
import { RoleGQL } from '../types/roleGQL';

@InputType()
export class RevokeRoleInput {
  @Field(() => ID)
  userId!: string;

  @Field(() => RoleGQL)
  role!: RoleGQL;
}