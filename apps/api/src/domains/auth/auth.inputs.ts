import { InputType, Field, Int } from "type-graphql";
import {UserRole} from "./auth.types";

@InputType()
export class RequestOtpInput{
    @Field(type => String)
    email: string;
}

@InputType()
export class VerifyEmailInput {
    @Field(type => String)
    email: string;

    @Field(type => String)
    otpCode: string
}


@InputType()
export class CompleteRegisterationInput {


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