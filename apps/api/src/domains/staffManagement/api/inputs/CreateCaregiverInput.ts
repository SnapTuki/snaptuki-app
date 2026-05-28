// src/domains/caregiverManagement/api/graphql/inputs/CaregiverInputs.ts
import { InputType, Field, ID } from "type-graphql";
import { StaffRoleAPI, EmploymentTypeAPI } from "../types/StaffTypes";
import { GraphQLDateTime } from "graphql-scalars";
@InputType()
export class RegisterCaregiverInputGql {
  @Field(() => ID) id!: string;
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => String) email!: string;
  @Field(() => String) phone!: string;
  
  @Field(() => StaffRoleAPI) role!: StaffRoleAPI;
  @Field(() => EmploymentTypeAPI) employmentType!: EmploymentTypeAPI;
  @Field(() => String) hireDate!: string;
  @Field(() => String) birthDate!: string;
}

@InputType()
export class CreateCaregiverProfileInputGql {
  @Field(() => ID) id!: string;
  @Field(() => String) firstName!: string;
  @Field(() => String) lastName!: string;
  @Field(() => String) email!: string;
  @Field(() => String,{ nullable: true }) phone?: string | null;
  @Field(() => StaffRoleAPI) role!: StaffRoleAPI;
  @Field(() => EmploymentTypeAPI) employmentType!: EmploymentTypeAPI;
  @Field(() => GraphQLDateTime) hireDate!: Date;
}

@InputType()
export class UpdateCaregiverContactInputGql {
  @Field(() => ID) id!: string;
  @Field(() => String) phone!: string;
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