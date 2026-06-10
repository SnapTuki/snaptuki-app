// src/domains/residentManagement/application/useCases/ListResidentsUseCase.ts

import { IResidentRepo } from "../interfaces/IResidentRepo";
import { MobilityLevel } from "../../domain/entities/Resident";
import { ResidentMap } from "../../infrastructure/prisma/mappers/ResidentMap";
import { ResidentDTO } from "../dtos/ResidentDTO";

export interface ListResidentsInput {
  search?: string | null;
  mobilityLevel?: string | null;
}

export class ListResidentsUseCase {
  constructor(private readonly residentRepo: IResidentRepo) {}

  async execute(input: ListResidentsInput): Promise<{ residents: ResidentDTO[] }> {
    console.log("Executing use case list residents");

    // 1. Fetch the raw aggregates from the repository using the corrected property key
    const rawResidents = await this.residentRepo.list({
      search: input.search ?? null,
      careLevel: (input.mobilityLevel as MobilityLevel) ?? null,
    });


    const residentDTOs = rawResidents.map((raw: any) => ({
      residentId: raw.residentId,
      agencyId: raw.agencyId,
      mrn: raw.mrn,
      firstName: raw.firstName,
      lastName: raw.lastName,
      birthDate: raw.birthDate,
      gender: raw.gender as any, 
      status: raw.status as any,
      mobilityLevel: raw.mobilityLevel as any,
      room: raw.room,
      
      allergies: raw.allergies.map((a:any) => ({
        id: a.id,
        name: a.name,
        reaction: a.reaction,
        severity: a.severity as any,
        notes: a.notes,
      })),
      
      medications: raw.medications.map((m:any) => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        startDate: m.startDate,
        endDate: m.endDate,
        prescribedBy: m.prescribedBy,
      })),
      
      emergencyContacts: raw.emergencyContacts.map((e: any) => ({
        id: e.id,
        name: e.name,
        relation: e.relation,
        phone: e.phone,
        isPrimary: e.isPrimary,
      })),

      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }));

    // 3. Return the clean, plain JSON array
    return { residents: residentDTOs };
  }
}