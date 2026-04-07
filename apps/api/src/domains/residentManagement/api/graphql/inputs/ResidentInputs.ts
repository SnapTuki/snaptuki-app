// src/domains/residentManagement/api/graphql/inputs/ResidentInputs.ts
import { InputType, Field, ID, registerEnumType } from "type-graphql";
import { Gender, MobilityLevel, AllergySeverity } from "../../../../../generated/prisma";

import { GraphQLDateTime } from "graphql-scalars";
registerEnumType(Gender, { name: "Gender" });
registerEnumType(MobilityLevel, { name: "MobilityLevel" });
registerEnumType(AllergySeverity, { name: "AllergySeverity" });


@InputType()
export class RegisterResidentInput {
  @Field(() => Number) agencyId!: number;
  @Field(() => String) mrn!: string;
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => GraphQLDateTime) birthDate!: Date;
  @Field(() => Gender) gender!: Gender;
  @Field(() => String, { nullable: true }) email?: string | null;
  @Field(() => String, { nullable: true }) phone?: string | null;
  @Field(() => MobilityLevel) mobilityLevel!: MobilityLevel;
  @Field(() => String, { nullable: true }) room?: string | null;
}

@InputType()
export class UpdateResidentContactInput {
  @Field(() => ID) id!: string;
  @Field(() => String, { nullable: true }) email?: string | null;
  @Field(() => String, { nullable: true }) phone?: string | null;
}



@InputType()
export class UpdateResidentMedicalProfileInput {
  @Field(() => ID) id!: string;
  @Field(() => MobilityLevel) mobilityLevel!: MobilityLevel;
  @Field(() => String, { nullable: true }) room?: string | null;
}

@InputType()
export class AssignPrimaryCaregiverInput {
  @Field(() => ID) residentId!: string;
  @Field(() => ID) caregiverId!: string;
}

@InputType()
export class AddResidentAllergyInput {
  @Field(() => ID) residentId!: string;
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) reaction!: string;
  @Field(() => AllergySeverity) severity!: AllergySeverity;
  @Field(() => String, { nullable: true }) notes?: string | null;
}

@InputType()
export class AddResidentMedicationInput {
  @Field(() => ID) residentId!: string;
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) dosage!: string;
  @Field(() => String) frequency!: string;
  @Field(() => GraphQLDateTime) startDate!: Date;
  @Field(() => GraphQLDateTime,{ nullable: true }) endDate?: Date | null;
  @Field(() => String,{ nullable: true }) prescribedBy?: string | null;
}