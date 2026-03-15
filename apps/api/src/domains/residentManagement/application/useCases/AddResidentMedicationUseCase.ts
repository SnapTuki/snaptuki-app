// src/domains/residentManagement/application/useCases/AddResidentMedicationUseCase.ts
import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Medication } from "../../../residentManagement/domain/entities/Medication";
import { Resident } from "../../../residentManagement/domain/entities/Resident";

export interface AddResidentMedicationInput {
  residentId: string;
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string | null;
  prescribedBy?: string | null;
}

export class AddResidentMedicationUseCase {
  constructor(private repo: IResidentRepo) {}

  public async execute(input: AddResidentMedicationInput): Promise<Resident> {
    const resident = await this.repo.getById(input.residentId);
    if (!resident) throw new Error("Resident not found");

    resident.addMedication(Medication.create({
      id: input.id,
      name: input.name,
      dosage: input.dosage,
      frequency: input.frequency,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      prescribedBy: input.prescribedBy ?? null,
    }));
    await this.repo.save(resident);
    return resident;
  }
}