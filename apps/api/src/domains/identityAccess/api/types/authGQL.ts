import { Field, ObjectType } from 'type-graphql';
import { UserAuthData } from './userAuthData';

@ObjectType()
export class AuthResultGQL {
  @Field(()=>String)
  token!: string;

  @Field(() => UserAuthData)
  user!: UserAuthData;
}