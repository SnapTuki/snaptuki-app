import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { MobilityLevel } from "../../generated/prisma";

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

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field({ nullable: true })
  date_of_birth?: Date;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  medical_notes?: string;

  @Field(() => MobilityLevel)
  mobility_level: MobilityLevel;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  created_at: Date;
}
