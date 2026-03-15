// src/domains/residentManagement/application/useCases/AssignPrimaryCaregiverUseCase.ts
import { IResidentRepo } from "../interfaces/IResidentRepo";

import { Resident } from "../../domain/entities/Resident";
export class AssignPrimaryCaregiverUseCase {
  constructor(
    private repo: IResidentRepo,
  ) {}

  public async execute(residentId: string, caregiverId: string) {
    const resident = await this.repo.getById(residentId);
    if (!resident) throw new Error("Resident not found");

    resident.setPrimaryCaregiver(caregiverId);
    await this.repo.save(resident);
    return resident;
  }
}