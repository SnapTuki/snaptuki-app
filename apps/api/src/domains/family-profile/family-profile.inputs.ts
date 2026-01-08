import { InputType, Field } from "type-graphql";
import { MobilityLevel } from "../../generated/prisma";

@InputType()
export class CreateElderInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  medicalNotes?: string;

  @Field({ nullable: true })
  mobilityLevel?: MobilityLevel //will be MobilityLevel enum later;
}

@InputType()
export class CreateFamilyProfileInput{

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    dateOfBirth: Date;

    @Field()
    address: string;

    @Field()
    postalCode: string;

    @Field()
    city: string;

    @Field()
    country: string
}

@InputType()
export class ElderProfileData{

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field()
  postalCode: string;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field()
  medicalNotes: string;

  @Field()
  mobilityLevel: MobilityLevel;

}