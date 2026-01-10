import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class FamilyProfile {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  userId: number;

  @Field(() => [ManagedElder])
  elders: ManagedElder[];

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class ManagedElder {
  @Field(() => ID)
  elderId: number;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(()=>Date,{ nullable: true })
  dateOfBirth?: Date;

  @Field(()=>String)
  mobilityLevel: string;

  @Field(()=>FamilyElderRelationship,{ nullable: true })
  relationship?: FamilyElderRelationship;

  @Field(()=>Boolean)
  isPrimaryContact: boolean;
}

@ObjectType()
class FamilyElderRelationship {

  @Field(()=>String,{ nullable: true })
  relationship?: string;

  @Field(()=>Boolean)
  isPrimaryContact: boolean;

  @Field(()=>Date)
  createdAt: Date;
}
