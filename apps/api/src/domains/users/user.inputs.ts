import { InputType, Field } from "type-graphql";
import {UserRole} from "./user.types";

@InputType()
export class RequestOtpInput{
    @Field()
    email: string;
}

@InputType()
export class CompleteRegisterationInput {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    birthdate: Date;

    @Field()
    password: string;

    @Field()
    email: string;

    @Field(type => UserRole)
    role: UserRole;
}