import { Field, InputType, Int } from "type-graphql";
import { Gender } from "../../generated/prisma";

// --- Filters ---

@InputType()
export class CaregiverFilterInput {
  @Field(() => Boolean, { nullable: true })
  verified?: boolean;

  @Field(() => String, { nullable: true })
  city?: string;

  // Filter by one or more service IDs
  @Field(() => [Int], { nullable: true })
  offeredServiceIds?: number[];

  @Field(() => Gender, {nullable: true})
  gender?: Gender
}
