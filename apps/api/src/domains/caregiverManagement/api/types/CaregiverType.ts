// src/domains/caregiverManagement/api/graphql/types/CaregiverTypes.ts
import { GraphQLDateTime } from "graphql-scalars";
import { ObjectType, Field, ID, registerEnumType } from "type-graphql";

export enum CaregiverRoleEnum { CAREGIVER = "CAREGIVER", HEAD_NURSE = "HEAD_NURSE", COORDINATOR = "COORDINATOR" }
export enum CaregiverStatusEnum { ACTIVE = "ACTIVE", INACTIVE = "INACTIVE", SUSPENDED = "SUSPENDED" }
export enum EmploymentTypeEnum { FULL_TIME = "FULL_TIME", PART_TIME = "PART_TIME", CONTRACT = "CONTRACT" }

registerEnumType(CaregiverRoleEnum, { name: "CaregiverRole" });
registerEnumType(CaregiverStatusEnum, { name: "CaregiverStatus" });
registerEnumType(EmploymentTypeEnum, { name: "EmploymentType" });

@ObjectType()
export class CertificationType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) issuer!: string;
  @Field(() => GraphQLDateTime) validFrom!: Date;
  @Field(() => GraphQLDateTime,{ nullable: true }) validTo!: Date | null;
}

@ObjectType()
export class CaregiverType {
  @Field(() => ID) id!: string;
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => String) email!: string;
  @Field(() => String, { nullable: true }) phone!: string | null;
  @Field(() => CaregiverRoleEnum) role!: CaregiverRoleEnum;
  @Field(() => CaregiverStatusEnum) status!: CaregiverStatusEnum;
  @Field(() => EmploymentTypeEnum) employmentType!: EmploymentTypeEnum;
  @Field(() => GraphQLDateTime) hireDate!: Date;
  @Field(()=>String,{ nullable: true }) userId!: string | null;
  @Field(() => [CertificationType]) certifications!: CertificationType[];
  @Field(() => GraphQLDateTime) createdAt!: Date;
  @Field(() => GraphQLDateTime) updatedAt!: Date;
}