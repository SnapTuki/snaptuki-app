import { InputType, Field } from "type-graphql";
import {UserRole} from "./auth.types";

@InputType()
export class RequestOtpInput{
    @Field(type => String)
    email: string;
}

@InputType()
export class CompleteRegisterationInput {

    @Field(type => String)
    otpCode: string;

    @Field(type => String)
    firstName: string;

    @Field( type => String)
    lastName: string;

    @Field(() => Date)
    birthdate: Date;

    @Field(type => String)
    password: string;

    @Field(type => String)
    email: string;

    @Field(type => UserRole)
    role: UserRole;
}

@InputType()
export class LoginCredentials {
    @Field(type => String)
    email: string;

    @Field(type => String)
    password: string;
}