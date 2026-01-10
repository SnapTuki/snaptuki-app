import { InputType, Field } from "type-graphql";
import { MobilityLevel } from "../../generated/prisma";

@InputType()
export class CreateElderInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  medicalNotes?: string;

  @Field(() => MobilityLevel, { nullable: true })
  mobilityLevel?: MobilityLevel //will be MobilityLevel enum later;
}

@InputType()
export class CreateFamilyProfileInput {

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Date)
  dateOfBirth: Date;

  @Field(() => String)
  address: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  country: string
}

@InputType()
export class ElderProfileData {

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  dateOfBirth: Date;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  medicalNotes: string;

  @Field(() => MobilityLevel)
  mobilityLevel: MobilityLevel;

}