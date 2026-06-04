// src/domains/residentManagement/api/graphql/types/ResidentTypes.ts

import { GraphQLDateTime, JSONResolver } from "graphql-scalars";
import { ObjectType, Field, ID, registerEnumType, Int } from "type-graphql";

// 1. IMPORT ENUMS EXCLUSIVELY FROM THE DOMAIN (No Prisma leaks!)
import { Gender, MobilityLevel, ResidentStatus } from "../../../domain/entities/Resident";
import { AllergySeverity } from "../../../domain/entities/Allergy";
import { TaskType } from "../../../../taskManagement/api/graphql/types/TaskTypes";
// 2. REGISTER OWNED ENUMS WITH TYPE-GRAPHQL
registerEnumType(Gender, { name: "Gender" });
registerEnumType(MobilityLevel, { name: "MobilityLevel" });
registerEnumType(ResidentStatus, { name: "ResidentStatus" });
registerEnumType(AllergySeverity, { name: "AllergySeverity" }); // Registered from domain layout

@ObjectType()
export class AllergyType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) reaction!: string;
  @Field(() => AllergySeverity) severity!: AllergySeverity;
  @Field(() => String, { nullable: true }) notes!: string | null;
}

@ObjectType()
export class MedicationType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) dosage!: string;
  @Field(() => String) frequency!: string;
  @Field(() => GraphQLDateTime) startDate!: Date;
  @Field(() => GraphQLDateTime, { nullable: true }) endDate!: Date | null;
  @Field(() => String, { nullable: true }) prescribedBy!: string | null;
}

@ObjectType()
export class EmergencyContactType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) relation!: string;
  @Field(() => String) phone!: string;
  @Field(() => Boolean) isPrimary!: boolean; 
}

@ObjectType("ResidentChecklistItem")
export class ChecklistItemType {
  @Field(() => String) label!: string; // Made definite to match DTO output
  @Field(() => Boolean) isCompleted!: boolean;
}

@ObjectType()
export class ActionRecordType {
  @Field(() => Int) id!: number;
  @Field(() => JSONResolver, { nullable: true }) value?: any;
  @Field(() => String, { nullable: true }) notes?: string | null;
  @Field(() => GraphQLDateTime) createdAt!: Date;
}



@ObjectType()
export class ResidentType {
  @Field(() => ID) residentId!: string;
  @Field(() => String) mrn!: string;
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => GraphQLDateTime) birthDate!: Date;
  @Field(() => Gender) gender!: Gender;
  @Field(() => ResidentStatus) status!: ResidentStatus;
  @Field(() => MobilityLevel) mobilityLevel!: MobilityLevel;
  @Field(() => String, { nullable: true }) room!: string | null;

  @Field(() => [TaskType])
  tasks?: TaskType[];

  @Field(() => GraphQLDateTime) createdAt!: Date;
  @Field(() => GraphQLDateTime) updatedAt!: Date;

  // Collection Arrays (Initialized as required arrays to mirror DTO structures cleanly)
  @Field(() => [AllergyType]) allergies!: AllergyType[];
  @Field(() => [MedicationType]) medications!: MedicationType[];
  @Field(() => [EmergencyContactType]) emergencyContacts!: EmergencyContactType[];
}