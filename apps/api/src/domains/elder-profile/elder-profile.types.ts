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

  @Field(()=>String)
  first_name: string;

  @Field(()=>String)
  last_name: string;

  @Field(()=>Date,{ nullable: true })
  date_of_birth?: Date;

  @Field(()=>String,{ nullable: true })
  address?: string;

  @Field(()=>String,{ nullable: true })
  phone?: string;

  @Field(()=>String,{ nullable: true })
  medical_notes?: string;

  @Field(() => MobilityLevel)
  mobility_level: MobilityLevel;

  @Field(()=>String,{ nullable: true })
  notes?: string;

  @Field(()=>Date)
  created_at: Date;
}
