// src/domains/staffManagement/infrastructure/mappers/StaffMap.ts
import { Staff, StaffRole, EmploymentType } from "../../domain/entities/Staff";
import { EmploymentTypeAPI, StaffRoleAPI, StaffType } from "../../api/types/StaffTypes";
import type { Staff as PrismaStaffProfile, Certification as PrismaCertification } from "../../../../generated/prisma/client";

export class StaffMap {
  
  /**
   * --- TO DOMAIN ---
   * Converts a Prisma database row into your rich Domain Aggregate.
   */
  static toDomain(raw: PrismaStaffProfile & { certifications?: PrismaCertification[] }): Staff {
    

    // 2. Reconstruct the Aggregate Root
    return Staff.restore({
      id: raw.id, // Synced ID from IdentityAccess
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone,
      role: raw.role as StaffRole,
      employmentType: raw.employmentType as EmploymentType,
      hireDate: raw.hireDate,
      birthDate: raw.birthDate,
      
      certifications: raw.certifications || []
    });
  }

  /**
   * --- TO PERSISTENCE ---
   * Extracts data safely using the Snapshot pattern to save to Prisma.
   */
  static toPersistence(staff: Staff) {
    // 1. Grab the read-only snapshot. NO direct property getters used!
    const state = staff.snapshot();

    return {
      id: state.id,
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phone: state.phone,
      role: state.role,
      employmentType: state.employmentType,
      hireDate: state.hireDate,
      birthDate: state.birthDate,
      // Note: In Prisma, updating nested arrays (certifications) usually requires 
      // a specialized query structure (create/update/delete operations), but you can 
      // pass the raw data array here to be processed by your repository.
      certifications: state.certifications.map(c => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        validFrom: c.validFrom, // Prisma handles Date objects directly
        validTo: c.validTo,
      }))
    };
  }

  /**
   * --- TO DTO (GraphQL) ---
   * Translates the domain snapshot into your strict TypeGraphQL API contract.
   */
  static toDTO(staff: Staff): StaffType {
    const state = staff.snapshot();

    return {
      id: state.id,
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phone: state.phone,
      
      // We map the singular organizational role here. 
      // IdentityAccess roles are handled completely separately!
      role: state.role as unknown as StaffRoleAPI, 
      employmentType: state.employmentType as unknown as EmploymentTypeAPI,
      hireDate: state.hireDate,
      
      certifications: state.certifications.map(c => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        validFrom: c.validFrom,
        validTo: c.validTo,
      })),
      
    };
  }
}