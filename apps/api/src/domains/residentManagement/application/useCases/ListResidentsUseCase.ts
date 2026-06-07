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
    const residents = await this.residentRepo.list({
      search: input.search ?? null,
      careLevel: (input.mobilityLevel as MobilityLevel) ?? null,
    });

    console.log(`Use case list residents found ${residents.length} records.`);

    // 2. Safely transform the entire collection into presentation-ready objects
    const residentDTOs = residents.map((resident:any) => ResidentMap.toDTO(resident));

    // 3. Return the clean, plain JSON array
    return { residents: residentDTOs };
  }
}