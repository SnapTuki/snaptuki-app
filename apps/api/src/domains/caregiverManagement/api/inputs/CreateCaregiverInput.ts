// src/domains/caregiverManagement/api/graphql/inputs/CaregiverInputs.ts
import { InputType, Field, ID } from "type-graphql";
import { CaregiverRoleEnum, EmploymentTypeEnum } from "../types/CaregiverType";
import { GraphQLDateTime } from "graphql-scalars";
@InputType()
export class RegisterCaregiverInputGql {
  @Field(() => ID) id!: string;
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => String) passwordHash!: string;
  @Field(() => String) email!: string;
  @Field(() => String,{ nullable: true }) phone?: string | null;
  @Field(() => CaregiverRoleEnum) role!: CaregiverRoleEnum;
  @Field(() => EmploymentTypeEnum) employmentType!: EmploymentTypeEnum;
  @Field(() => GraphQLDateTime) hireDate!: Date;
  @Field(()=>Number,{ nullable: true }) agencyId?: number | null;
}

@InputType()
export class CreateCaregiverProfileInputGql {
  @Field(() => ID) id!: string;
  @Field(() => String) userId!: string; // already created in IdentityAccess
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => String) email!: string;
  @Field(() => String,{ nullable: true }) phone?: string | null;
  @Field(() => CaregiverRoleEnum) role!: CaregiverRoleEnum;
  @Field(() => EmploymentTypeEnum) employmentType!: EmploymentTypeEnum;
  @Field(() => GraphQLDateTime) hireDate!: Date;
}

@InputType()
export class UpdateCaregiverContactInputGql {
  @Field(() => ID) id!: string;
  @Field(()=>String) email!: string;
  @Field(() => String,{ nullable: true }) phone?: string | null;
}

@InputType()
export class AddCaregiverCertificationInputGql {
  @Field(() => ID) caregiverId!: string;
  @Field(() => ID) certId!: string;
  @Field(() => String) name!: string;
  @Field(() => String) issuer!: string;
  @Field(() => GraphQLDateTime) validFrom!: Date;
  @Field(() => GraphQLDateTime,{ nullable: true }) validTo?: Date | null;
}