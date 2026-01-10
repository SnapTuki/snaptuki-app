import { Field, InputType } from "type-graphql";
import { MobilityLevel } from "../../generated/prisma";

/* ---------------- UPDATE ELDER ---------------- */

@InputType()
export class UpdateElderProfileInput {
  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  medical_notes?: string;

  @Field(() => MobilityLevel, { nullable: true })
  mobility_level?: MobilityLevel;

  @Field({ nullable: true })
  notes?: string;
}
