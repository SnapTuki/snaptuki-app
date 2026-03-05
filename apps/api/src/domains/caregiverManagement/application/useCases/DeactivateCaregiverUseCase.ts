// src/domains/caregiverManagement/application/useCases/DeactivateCaregiverUseCase.ts
import { ICaregiverRepo } from "../interfaces/ICaregiverRepo";
import { Caregiver } from "../../domain/entities/Caregiver";

export class DeactivateCaregiverUseCase {
  constructor(private repo: ICaregiverRepo) {}

  public async execute(id: string): Promise<Caregiver> {
    const caregiver = await this.repo.getById(id);
    if (!caregiver) throw new Error("Caregiver not found");

    caregiver.deactivate();
    await this.repo.save(caregiver);
    return caregiver;
  }
}