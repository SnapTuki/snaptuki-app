import { Field, InputType } from 'type-graphql';
import { RoleGQL } from '../types/roleGQL';

@InputType()
export class RegisterUserInput {
  @Field(() => String)
  email!: string;

  @Field(()=>String)
  password!: string;

  @Field(() => [RoleGQL], { nullable: true })
  roles?: RoleGQL[];

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => Number, { nullable: true })
  agencyId?: number;
}