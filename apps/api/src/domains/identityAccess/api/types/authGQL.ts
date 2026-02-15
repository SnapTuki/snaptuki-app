import { Field, ObjectType } from 'type-graphql';
import { UserGQL } from './userGQL';

@ObjectType()
export class AuthResultGQL {
  @Field(()=>String)
  token!: string;

  @Field(() => UserGQL)
  user!: UserGQL;
}