// src/domains/residentManagement/infrastructure/mappers/EmergencyContactMap.ts

import { EmergencyContact } from "../../../domain/entities/EmergencyContact";

/**
 * Decoupled Prisma type for the mapper.
 * Assumes your Prisma schema matches these fields.
 */
export type PrismaEmergencyContactRow = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string | null;
  isPrimary: boolean;
};

export class EmergencyContactMap {
  /**
   * 1. INFRASTRUCTURE -> DOMAIN (Read)
   * Maps a single Prisma row into a Domain Child Entity
   */
  static toDomain(row: PrismaEmergencyContactRow): EmergencyContact {
    // We trust the database state, so we use restore!
    return EmergencyContact.restore({
      id: row.id,
      name: row.name,
      relation: row.relation,
      phone: row.phone,     // The restore method expects raw strings
      email: row.email,     // and converts them to Value Objects internally
    });
  }

  /**
   * 2. DOMAIN -> INFRASTRUCTURE (Write)
   * Converts the Domain Child Entity back into a raw object for Prisma to save
   */
  static toPrisma(contact: EmergencyContact) {
    const state = contact.snapshot();

    return {
      id: state.id,
      name: state.name,
      relation: state.relation,
      phone: state.phone,
      email: state.email,
    };
  }
}