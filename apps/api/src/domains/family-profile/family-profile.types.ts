import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class FamilyProfile {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  userId: number;

  @Field(() => [ManagedElder])
  elders: ManagedElder[];

  @Field()
  createdAt: Date;
}

@ObjectType()
export class ManagedElder {
  @Field(() => ID)
  elderId: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field()
  mobilityLevel: string;

  @Field({ nullable: true })
  relationship?: FamilyElderRelationship;

  @Field()
  isPrimaryContact: boolean;
}

@ObjectType()
class FamilyElderRelationship {

  @Field({ nullable: true })
  relationship?: string;

  @Field()
  isPrimaryContact: boolean;

  @Field()
  createdAt: Date;
}
