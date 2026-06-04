// src/domains/residentManagement/api/graphql/inputs/ResidentInputs.ts

import { InputType, Field, ID, Int } from "type-graphql";
import { GraphQLDateTime } from "graphql-scalars";

// Import types exclusively from the domain boundaries
import { Gender, MobilityLevel } from "../../../domain/entities/Resident";
import { AllergySeverity } from "../../../domain/entities/Allergy";

@InputType()
export class RegisterResidentInput {
  @Field(() => Int) agencyId!: number; // Fixed type to map Int scalar properly
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => String) ssn!: string;
  @Field(() => String) birthDate!: string;
  @Field(() => Gender) gender!: Gender;
  @Field(() => [EmergencyContactInput]) emergencyContacts!: EmergencyContactInput[]
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
  // REMOVED: id field. Managed by UseCase lifecycle.
  @Field(() => String) name!: string;
  @Field(() => String) reaction!: string;
  @Field(() => AllergySeverity) severity!: AllergySeverity;
  @Field(() => String, { nullable: true }) notes?: string | null;
}

@InputType()
export class AddResidentMedicationInput {
  @Field(() => ID) residentId!: string;
  // REMOVED: id field. Managed by UseCase lifecycle.
  @Field(() => String) name!: string;
  @Field(() => String) dosage!: string;
  @Field(() => String) frequency!: string;
  @Field(() => GraphQLDateTime) startDate!: Date;
  @Field(() => GraphQLDateTime, { nullable: true }) endDate?: Date | null;
  @Field(() => String, { nullable: true }) prescribedBy?: string | null;
}

@InputType()
export class UpdateResidentIdentityInput {
  @Field(() => ID) residentId!: string;
  @Field(() => String, { nullable: true }) firstName?: string;
  @Field(() => String, { nullable: true }) lastName?: string;
  @Field(() => GraphQLDateTime, { nullable: true }) birthDate?: Date; // FIXED: Removed string type union
  @Field(() => Gender, { nullable: true }) gender?: Gender; 
  // REMOVED: ssn (Not present in domain props)
}

@InputType()
export class UpdateResidentPlacementInput {
  @Field(() => ID) residentId!: string; // Renamed 'id' to 'residentId' to match use case input key
  @Field(() => String, { nullable: true }) room?: string;
  @Field(() => MobilityLevel, { nullable: true }) mobilityLevel?: MobilityLevel;
  // REMOVED: admissionDate (Not present in domain props)
}

@InputType()
export class EmergencyContactInput {
  @Field(() => ID, { nullable: true }) id!: string | null;
  @Field(() => String) name!: string;
  @Field(() => String) relation!: string;
  @Field(() => String) phone!: string;
  @Field(() => String, { nullable: true }) email?: string | null; // Added missing email field to support your entities
}

@InputType()
export class UpdateResidentContactsInput {
  @Field(() => ID) residentId!: string;
  @Field(() => [EmergencyContactInput]) contacts!: EmergencyContactInput[];
}