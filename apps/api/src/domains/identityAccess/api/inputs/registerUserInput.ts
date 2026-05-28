import { Field, InputType } from 'type-graphql';
import { UserRole } from '../types/userAuthData';
@InputType()
export class RegisterUserInput {
  @Field(() => String)
  email!: string;

  @Field(()=>String)
  password!: string;

  @Field(() => [UserRole])
  roles!: UserRole[];

  @Field(() => String) 
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => Number, { nullable: true })
  agencyId?: number;
}