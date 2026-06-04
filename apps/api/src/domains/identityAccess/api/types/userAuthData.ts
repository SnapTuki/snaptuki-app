import { Field, ObjectType, ID } from 'type-graphql';
import { registerEnumType } from 'type-graphql';

// Keep in sync with your Role VO / Prisma enum
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COORDINATOR = 'COORDINATOR',
  DOCTOR = 'DOCTOR',
  HEAD_NURSE = 'HEAD_NURSE',
  NURSE = 'NURSE',
  PRACTICAL_NURSE = 'PRACTICAL_NURSE'
}

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType('User')
export class UserAuthData {
  @Field(() => ID)
  userId!: string;

  @Field(() => [UserRole])
  roles!: UserRole[];

  @Field(() => Number) agencyId!: number;

}