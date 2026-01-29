import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { FamilyProfile } from "../family-profile/family-profile.types";
export enum UserRole{
    FAMILY="FAMILY",
    CAREGIVER="CAREGIVER",
    ELDER="ELDER",
    ADMIN="ADMIN"
}

registerEnumType(UserRole, {
    name: "UserRole"
})


@ObjectType()
export class User{
    @Field(type => ID)
    id: number;
    
    @Field(type => String)
    firstName: string;

    @Field(type => String)
    lastName: string;

    @Field(type => String)
    email: string;

    @Field(type => UserRole)
    role: UserRole;

    @Field(type => FamilyProfile)
    familyMemberProfile?: FamilyProfile
}

@ObjectType()
export class OtpRegisteration{

    @Field(type => Boolean)
    success: boolean;

    @Field(type => String)
    email: string;

    @Field(type => String)
    otpCode: string;

    @Field(type => String)
    msg: string;
}

@ObjectType()
export class UserWithToken{

    @Field(type => User)
    user: User;

    @Field(type => String)
    token: string;
}

