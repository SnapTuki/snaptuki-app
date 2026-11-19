// src/domains/residentManagement/api/graphql/types/ResidentTypes.ts

import { GraphQLDateTime } from "graphql-scalars";
import { ObjectType, Field, ID, registerEnumType, Int } from "type-graphql";

// 1. IMPORT ENUMS EXCLUSIVELY FROM THE DOMAIN (No Prisma leaks!)
import { Gender, MobilityLevel, ResidentStatus } from "../../../domain/entities/Resident";

registerEnumType(Gender, { name: "Gender" });
registerEnumType(MobilityLevel, { name: "MobilityLevel" });
registerEnumType(ResidentStatus, { name: "ResidentStatus" });

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

  @Field(() => GraphQLDateTime) createdAt!: Date;
  @Field(() => GraphQLDateTime) updatedAt!: Date;

}