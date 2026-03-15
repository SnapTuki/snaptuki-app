// src/domains/residentManagement/application/useCases/AddResidentAllergyUseCase.ts
import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Allergy } from "../../../residentManagement/domain/entities/Allergy";
import { Resident } from "../../../residentManagement/domain/entities/Resident";

export interface AddResidentAllergyInput {
  residentId: string;
  id: string;
  name: string;
  reaction: string;
  severity: "MILD" | "MODERATE" | "SEVERE";
  notes?: string | null;
}

export class AddResidentAllergyUseCase {
  constructor(private repo: IResidentRepo) {}

  public async execute(input: AddResidentAllergyInput): Promise<Resident> {
    const resident = await this.repo.getById(input.residentId);
    if (!resident) throw new Error("Resident not found");

    resident.addAllergy(Allergy.create({
      id: input.id,
      name: input.name,
      reaction: input.reaction,
      severity: input.severity,
      notes: input.notes ?? null,
    }));
    await this.repo.save(resident);
    return resident;
  }
}