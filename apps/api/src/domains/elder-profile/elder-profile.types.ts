import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { MobilityLevel } from "../../generated/prisma";
import { GraphQLDateTime } from "graphql-scalars";
/* ---------------- ENUMS ---------------- */

registerEnumType(MobilityLevel, {
  name: "MobilityLevel",
  description: "Mobility level of the elder",
});

/* ---------------- TYPES ---------------- */

@ObjectType()
export class ElderProfile {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => GraphQLDateTime)
  dateOfBirth: Date;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  postalCode?: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  medicalNotes?: string;

  @Field(() => MobilityLevel)
  mobilityLevel: MobilityLevel;

  @Field(() => String, { nullable: true })
  notes?: string;

}


@ObjectType()
export class ElderProfileCard {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => GraphQLDateTime)
  dateOfBirth: Date;

  @Field(() => MobilityLevel)
  mobilityLevel: MobilityLevel;
}