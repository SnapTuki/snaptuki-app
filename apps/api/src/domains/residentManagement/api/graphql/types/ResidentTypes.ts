// src/domains/residentManagement/api/graphql/types/ResidentTypes.ts
import { GraphQLDateTime } from "graphql-scalars";
import { ObjectType, Field, ID, registerEnumType } from "type-graphql";

export enum GENDER { MALE="MALE", FEMALE="FEMALE", OTHER="OTHER", UNSPECIFIED="UNSPECIFIED" }
export enum MOBILITY_LEVEL { INDEPENDENT="INDEPENDENT", ASSISTED="ASSISTED", MEMORY="MEMORY" }
export enum ALLERGY_SERVERITY { MILD="MILD", MODERATE="MODERATE", SEVERE="SEVERE" }

registerEnumType(GENDER, { name: "Gender" });
registerEnumType(MOBILITY_LEVEL, { name: "MobilityLevel" });
registerEnumType(ALLERGY_SERVERITY, { name: "AllergySeverity" });

@ObjectType()
export class AllergyType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) reaction!: string;
  @Field(() => ALLERGY_SERVERITY) severity!: ALLERGY_SERVERITY;
  @Field(() => String,{ nullable: true }) notes!: string | null;
}

@ObjectType()
export class MedicationType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) dosage!: string;
  @Field(() => String) frequency!: string;
  @Field(() => GraphQLDateTime) startDate!: Date;
  @Field(() => GraphQLDateTime,{ nullable: true }) endDate!: Date | null;
  @Field(() => String, { nullable: true }) prescribedBy!: string | null;
}

@ObjectType()
export class EmergencyContactType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) relation!: string;
  @Field(() => String) phone!: string;
  @Field(() => String,{ nullable: true }) email!: string | null;
}

@ObjectType()
export class ResidentType {
  @Field(() => ID) id!: string;
  @Field(() => String) mrn!: string;
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => GraphQLDateTime) birthDate!: Date;
  @Field(() => GENDER) gender!: GENDER;
  @Field(() => String, { nullable: true }) email!: string | null;
  @Field(() => String, { nullable: true }) phone!: string | null;


  @Field(() => MOBILITY_LEVEL) mobilityLevel!: MOBILITY_LEVEL;
  @Field(() => String,{ nullable: true }) room!: string | null;

  @Field(()=>String,{ nullable: true }) primaryCaregiverId!: string | null;
  @Field(() => String,{ nullable: true }) guardianUserId!: string | null;

  @Field(() => [AllergyType]) allergies!: AllergyType[];
  @Field(() => [MedicationType]) medications!: MedicationType[];
  @Field(() => [EmergencyContactType]) emergencyContacts!: EmergencyContactType[];
}