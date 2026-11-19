// src/domains/residentManagement/infrastructure/mappers/ResidentMap.ts

import { Resident } from "../../../domain/entities/Resident";
import { ResidentDTO } from "../../../application/dtos/ResidentDTO";

// Assuming these are your enum mappers
import { toDomainGender } from "./GenderMap";
import { toDomainResidentStatus } from "./ResidentStatusMap";
import { toDomainMobilityLevel } from "./MobilityLevelMap";

import type {
  Resident as PrismaResident,
} from "../../../../../generated/prisma";

// Define the full Prisma row type for clean arguments

export class ResidentMap {

  /**
   * 1. INFRASTRUCTURE -> DOMAIN (Read)
   */
  static toDomain(row: PrismaResident | null): Resident | null {
    if (!row) return null;

    // Use the Rehydration Factory to load the aggregate safely
    return Resident.restore({
      residentId: row.residentId,
      agencyId: row.agencyId,
      mrn: row.mrn, // Restore expects the raw string, it creates the VO internally
      firstName: row.firstName,
      lastName: row.lastName,
      birthDate: row.birthDate,
      ssn: row.ssn,
      gender: toDomainGender(row.gender),
      status: toDomainResidentStatus(row.status),
      mobilityLevel: toDomainMobilityLevel(row.mobilityLevel),
      room: row.room ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  /**
   * 2. DOMAIN -> INFRASTRUCTURE (Write)
   */
  static toPersistence(resident: Resident) {
    // ONE call to get the entire un-encapsulated state of the Aggregate
    const state = resident.snapshot();

    const persistenceData:any = {
      agencyId: state.agencyId,
      mrn: state.mrn,
      firstName: state.firstName,
      lastName: state.lastName,
      birthDate: state.birthDate,
      ssn: state.ssn,
      gender: state.gender,
      status: state.status,
      mobilityLevel: state.mobilityLevel,
      room: state.room,

    }

    return persistenceData;
  }

/**
   * 3. DOMAIN -> PRESENTATION (API/GraphQL)
   */
  static toDTO(resident: Resident): ResidentDTO {
    // 1. Safely extract the raw state from the Domain Aggregate
    const state = resident.snapshot();

    return {
      residentId: state.residentId, 
      agencyId: state.agencyId,
      mrn: state.mrn,
      firstName: state.firstName,
      lastName: state.lastName,
      birthDate: state.birthDate,
      gender: state.gender,
      status: state.status,
      mobilityLevel: state.mobilityLevel,
      room: state.room,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
    };
  }
}