// src/domains/caregiverManagement/api/graphql/types/CaregiverTypes.ts
import { GraphQLDateTime } from "graphql-scalars";
import { ObjectType, Field, ID, registerEnumType } from "type-graphql";

export enum StaffRoleAPI {
  MANAGER = "MANAGER",
  HEAD_NURSE = "HEAD_NURSE",
  NURSE = "NURSE",
  PRACTICAL_NURSE = "PRACTICAL_NURSE",
  DOCTOR = "DOCTOR",
  COORDINATOR = "COORDINATOR"
}
export enum EmploymentTypeAPI {
  CONTRACT = "CONTRACT",
  PART_TIME= "PART_TIME",
  FULL_TIME="FULL_TIME",
}

registerEnumType(EmploymentTypeAPI, {
  name: "EmploymentType"
});
registerEnumType(StaffRoleAPI, {
  name: "StaffRole"
});


@ObjectType()
export class CertificationType {
  @Field(() => ID) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) issuer!: string;
  @Field(() => GraphQLDateTime) validFrom!: Date;
  @Field(() => GraphQLDateTime,{ nullable: true }) validTo!: Date | null;
}

@ObjectType()
export class StaffType {
  @Field(() => ID) id!: string;
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => String) email!: string;
  @Field(() => String, { nullable: true }) phone!: string | null;
  @Field(() => [StaffRoleAPI]) role!: StaffRoleAPI;
  @Field(() => EmploymentTypeAPI) employmentType!: EmploymentTypeAPI;
  @Field(() => GraphQLDateTime) hireDate!: Date;
  @Field(() => [CertificationType]) certifications!: CertificationType[];
  @Field(() => GraphQLDateTime) createdAt?: Date;
  @Field(() => GraphQLDateTime) updatedAt?: Date;
}