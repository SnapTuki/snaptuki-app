// src/domains/residentManagement/api/graphql/inputs/ResidentInputs.ts
import { InputType, Field, ID, registerEnumType } from "type-graphql";
import { AllergySeverity } from "../../../../../generated/prisma";
import { Gender, MobilityLevel } from "../../../domain/entities/Resident";
import { GraphQLDateTime } from "graphql-scalars";


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

@InputType()
export class UpdateResidentIdentityInput {
  @Field(() => ID)
  residentId: string;

  @Field(() => String,{ nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => GraphQLDateTime, { nullable: true })
  birthDate?: Date | String;

  @Field(() => Gender, { nullable: true })
  gender?: Gender; 

  @Field(() => String, { nullable: true })
  ssn?: string; // Social Security Number
}

@InputType()
export class UpdateResidentPlacementInput {
  @Field(() => ID)
  residentId: string;

  @Field(() => String, { nullable: true })
  room?: string;

  @Field(() => MobilityLevel, { nullable: true })
  mobilityLevel?: MobilityLevel; // e.g., 'INDEPENDENT' | 'ASSISTED' | 'MEMORY'

  @Field(() => GraphQLDateTime, { nullable: true })
  admissionDate?: Date;
}


@InputType()
export class EmergencyContactInput {
  @Field(() => ID, { nullable: true })
  id?: string; // If null, the UseCase knows to create a new one

  @Field(() => String)
  name: string;

  @Field(() => String)
  relation: string;

  @Field(() => String)
  phone: string;

  @Field(() => Boolean, { defaultValue: false })
  isPrimary: boolean;
}

@InputType()
export class UpdateResidentContactsInput {
  @Field(() => ID)
  residentId: string;

  @Field(() => [EmergencyContactInput])
  contacts: EmergencyContactInput[];
}