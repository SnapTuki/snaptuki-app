// src/domains/caregiverManagement/application/useCases/UpdateCaregiverContactUseCase.ts
import { IStaffRepo } from "../interfaces/IStaffRepo";
import { Staff } from "../../domain/entities/Staff";
import { PhoneNumber } from "../../domain/valueObjects/PhoneNumber";

export interface UpdateCaregiverContactInput {
  id: string;
  phone: string;
}

export class UpdateCaregiverContactUseCase {
  constructor(private repo: IStaffRepo) {}

  public async execute(input: UpdateCaregiverContactInput): Promise<Staff> {
    const caregiver = await this.repo.getById(input.id);
    if (!caregiver) throw new Error("Caregiver not found");

    //create phone OV
    const phoneOV = PhoneNumber.create(input.phone);
    caregiver.updateContactDetails(phoneOV);
    await this.repo.save(caregiver);
    return caregiver;
  }
}