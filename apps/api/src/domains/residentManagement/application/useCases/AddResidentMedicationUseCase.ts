// src/domains/residentManagement/application/useCases/AddResidentMedicationUseCase.ts

import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Medication } from "../../domain/entities/Medication";
import { ResidentMap } from "../../infrastructure/mappers/ResidentMap";
import { ResidentDTO } from "../dtos/ResidentDTO";

export interface AddResidentMedicationInput {
  residentId: string;
  // REMOVED: id. Generated securely by the use case.
  name: string;
  dosage: string;
  frequency: string;
  startDate: string; // Handled as string input, parsed to Date below
  endDate?: string | null;
  prescribedBy?: string | null;
}

export class AddResidentMedicationUseCase {
  constructor(private readonly repo: IResidentRepo) {}

  public async execute(input: AddResidentMedicationInput): Promise<{ resident: ResidentDTO }> {
    // 1. Fetch the Aggregate Root
    const resident = await this.repo.getById(input.residentId);
    if (!resident) {
      throw new Error(`Resident with ID ${input.residentId} not found.`);
    }

    // 2. Generate a secure, application-level ID for the new child entity
    const medicationId = crypto.randomUUID();

    // 3. Delegate to the Aggregate Root using the strict createNew factory
    resident.addMedication(Medication.createNew({
      id: medicationId,
      name: input.name,
      dosage: input.dosage,
      frequency: input.frequency,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      prescribedBy: input.prescribedBy,
    }));

    // 4. Save the aggregate state using the unified repository pattern
    await this.repo.save(resident);

    // 5. Transform and safely return the presentation layer data
    return { resident: ResidentMap.toDTO(resident) };
  }
}