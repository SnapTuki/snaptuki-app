// src/domains/residentManagement/application/useCases/AddResidentAllergyUseCase.ts

import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Allergy, AllergySeverity } from "../../domain/entities/Allergy";
import { ResidentMap } from "../../infrastructure/mappers/ResidentMap";
import { ResidentDTO } from "../dtos/ResidentDTO";

export interface AddResidentAllergyInput {
  residentId: string;
  // REMOVED: id. The backend will generate this securely.
  name: string;
  reaction: string;
  severity: "MILD" | "MODERATE" | "SEVERE";
  notes?: string | null;
}

export class AddResidentAllergyUseCase {
  constructor(private readonly repo: IResidentRepo) {}

  public async execute(input: AddResidentAllergyInput): Promise<{ resident: ResidentDTO }> {
    // 1. Load the Aggregate Root
    const resident = await this.repo.getById(input.residentId);
    if (!resident) {
        throw new Error(`Resident with ID ${input.residentId} not found.`);
    }

    // 2. Generate the ID for the new child entity
    const allergyId = crypto.randomUUID();

    // 3. Call the domain behavior using the strict createNew factory
    resident.addAllergy(Allergy.createNew({
      id: allergyId,
      name: input.name,
      reaction: input.reaction,
      severity: input.severity as AllergySeverity,
      notes: input.notes,
    }));

    // 4. Save the mutated aggregate back to the database
    await this.repo.save(resident);

    // 5. Safely return a plain data object to the presentation layer
    return { resident: ResidentMap.toDTO(resident) };
  }
}