//business rules
//Defines allowed roles and guarantees correctness.
export type UserRole = "SUPER_ADMIN" | "AGENCY_ADMIN" | "SUPERVISOR" | "CAREGIVER"

export class Role {
    private constructor (public readonly role: UserRole){}

    static superAdmin(){return new Role("SUPER_ADMIN")}

    static agencyAdmin(){return new Role("AGENCY_ADMIN")}

    static supervisor(){return new Role("SUPERVISOR")}

    static caregiver(){return new Role("CAREGIVER")}
    
}