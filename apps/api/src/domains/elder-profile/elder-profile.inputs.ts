import { Field, InputType, Int } from "type-graphql";
import { MobilityLevel } from "../../generated/prisma";
import { GraphQLDateTime } from "graphql-scalars";

/* ---------- CREATE ---------- */

@InputType()
export class CreateElderProfileInput {

  @Field(() => String)
  firstName?: string;

  @Field(() => String)
  lastName?: string;

  @Field(() => GraphQLDateTime)
  dateOfBirth?: Date;

  @Field(() => String)
  address?: string;

  @Field(() => String)
  phone?: string;

  @Field(() => String)
  medicalNotes?: string;

  @Field(() => MobilityLevel)
  mobilityLevel?: MobilityLevel;

  @Field(() => Int)
  familyMemberId: number

  @Field(() => String)
  relationship?: string
}

/* ---------- UPDATE ---------- */

@InputType()
export class UpdateElderProfileInput {

  @Field(() => String)
  firstName?: string;

  @Field(() => String)
  lastName?: string;

  @Field(() => GraphQLDateTime)
  dateOfBirth?: Date;

  @Field(() => String)
  address?: string;

  @Field(() => String)
  phone?: string;

  @Field(() => String)
  medicalNotes?: string;

  @Field(() => MobilityLevel)
  mobilityLevel?: MobilityLevel;

}
