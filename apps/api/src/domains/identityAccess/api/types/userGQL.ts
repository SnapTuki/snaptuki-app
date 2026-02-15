import { Field, ObjectType, ID } from 'type-graphql';
import { RoleGQL } from './roleGQL';
import { GraphQLDateTime } from 'graphql-scalars';
@ObjectType('User')
export class UserGQL {
  @Field(() => ID)
  userId!: string;

  @Field(()=>String)
  email!: string;

  @Field(() => [RoleGQL])
  roles!: RoleGQL[];

  @Field(()=>Boolean)
  active!: boolean;

  @Field(()=>String, { nullable: true })
  firstName?: string | null;

  @Field(()=>String, { nullable: true })
  lastName?: string | null;

  @Field(()=>String, { nullable: true })
  agencyId?: number | null;

  @Field(() => GraphQLDateTime)
  createdAt!: Date;

  @Field(() => GraphQLDateTime)
  updatedAt!: Date;
}