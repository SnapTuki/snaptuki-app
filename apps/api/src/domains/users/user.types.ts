import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

export enum UserRole{
    FAMILY_MEMBER = "FAMILY MEMBER",
    CAREGIVER = "CAREGIVER",
    ELDER = "ELDER",
    ADMIN = "ADMIN"
}

registerEnumType(UserRole, {
    name: "Role"
})


@ObjectType()
export class User{
    @Field(type => ID)
    id: string;
    
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field(type => UserRole)
    role: UserRole;
}

