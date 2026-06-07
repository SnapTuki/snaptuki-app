// src/domains/residentManagement/infrastructure/mappers/ResidentMap.ts

import { Resident } from "../../../domain/entities/Resident";
import { ResidentDTO } from "../../../application/dtos/ResidentDTO";

// Assuming these are your enum mappers
import { toDomainGender } from "./GenderMap";
import { toDomainResidentStatus } from "./ResidentStatusMap";
import { toDomainMobilityLevel } from "./MobilityLevelMap";

import type {
  Resident as PrismaResident,
  Allergy as PrismaAllergy,
  Medication as PrismaMedication,
  EmergencyContact as PrismaEC,
  ResidentTaskAssignment as PrismaTaskAssignment,
  Task as PrismaTask,
  ChecklistItem as PrismaChecklistItem,
  ActionRecord as PrismaActionRecord
} from "../../../../../generated/prisma";

// Define the full Prisma row type for clean arguments
type FullPrismaResident = PrismaResident & {
  allergies?: PrismaAllergy[];
  medications?: PrismaMedication[];
  emergencyContacts?: PrismaEC[];
  taskAssignments?: PrismaTaskAssignment[];
  tasks?: (PrismaTask & { checklist: PrismaChecklistItem[]; actionRecords: PrismaActionRecord[] })[];
};

export class ResidentMap {

  /**
   * 1. INFRASTRUCTURE -> DOMAIN (Read)
   */
  static toDomain(row: FullPrismaResident | null): Resident | null {
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

      // Pass the raw arrays; Resident.restore() will map them to ChildEntity.restore() internally
      allergies: row.allergies ?? [],
      medications: row.medications ?? [],
      emergencyContacts: row.emergencyContacts ?? [],
      taskAssignments: row.taskAssignments ?? [],
      tasks: row.tasks ?? [],

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
      allergies: {
        deleteMany: {},
        create: state.allergies.map(a => ({
          id: a.id,
          name: a.name,
          reaction: a.reaction,
          severity: a.severity,
          notes: a.notes
        }))
      },

      medications: {
        deleteMany: {},
        create: state.medications.map(m => ({
          id: m.id,
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          startDate: m.startDate,
          endDate: m.endDate,
          prescribedBy: m.prescribedBy
        }))
      },
      emergencyContacts: {
        deleteMany: {},
        create: state.emergencyContacts.map(ec => ({
          id: ec.id,
          name: ec.name,
          relation: ec.relation,
          phone: ec.phone,
          email: ec.email,
          isPrimary: ec.isPrimary
        }))
      },

      taskAssignments: {
        deleteMany: {},
        create: state.taskAssignments.map(ta => ({
          id: ta.id,
          taskTemplateId: ta.taskTemplateId,
          isActive: ta.isActive,
        }))
      },

    }

    return persistenceData;
  }

  /**
   * 3. DOMAIN -> PRESENTATION (API/GraphQL)
   */
  static toDTO(row: any): ResidentDTO {

    return {
      residentId: row.residentId,
      agencyId: row.agencyId,
      mrn: row.mrn,
      firstName: row.firstName,
      lastName: row.lastName,
      birthDate: row.birthDate,
      gender: row.gender,
      status: row.status,
      mobilityLevel: row.mobilityLevel,
      room: row.room,
      tasks: row.tasks,
      // State arrays already contain clean, plain objects! 
      // We can map them directly to the DTO without calling getters.
      allergies: row.allergies,
      medications: row.medications,
      emergencyContacts: row.emergencyContacts,

      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}