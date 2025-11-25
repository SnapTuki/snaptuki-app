import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class LoginCredentials{

    @Field(type => String)
    email: string;

    @Field(type => String)
    password: string
}

