// src/domains/residentManagement/application/useCases/UpdateResidentMedicalProfileUseCase.ts
import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Resident, MobilityLevel } from "../../../residentManagement/domain/entities/Resident";

export interface UpdateResidentMedicalProfileInput {
  id: string;
  mobilityLevel: MobilityLevel;
  room?: string | null;
}

export class UpdateResidentMedicalProfileUseCase {
  constructor(private repo: IResidentRepo) {}

  public async execute(input: UpdateResidentMedicalProfileInput): Promise<Resident> {
    const resident = await this.repo.getById(input.id);
    if (!resident) throw new Error("Resident not found");

    resident.changeCareLevel(input.mobilityLevel, input.room ?? null);
    await this.repo.save(resident);
    return resident;
  }
}