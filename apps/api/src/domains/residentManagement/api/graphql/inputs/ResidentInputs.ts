// src/domains/residentManagement/api/graphql/inputs/ResidentInputs.ts
import { InputType, Field, ID } from "type-graphql";
import { GENDER, MOBILITY_LEVEL, ALLERGY_SERVERITY } from "../types/ResidentTypes";
import { GraphQLDateTime } from "graphql-scalars";


@InputType()
export class RegisterResidentInput {
  @Field(() => ID) id!: string;
  @Field(() => String) mrn!: string;
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => GraphQLDateTime) birthDate!: Date;
  @Field(() => GENDER) gender!: GENDER;
  @Field(() => String, { nullable: true }) email?: string | null;
  @Field(() => String, { nullable: true }) phone?: string | null;
  @Field(() => MOBILITY_LEVEL) mobilityLevel!: MOBILITY_LEVEL;
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
  @Field(() => MOBILITY_LEVEL) mobilityLevel!: MOBILITY_LEVEL;
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
  @Field(() => ALLERGY_SERVERITY) severity!: ALLERGY_SERVERITY;
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