// src/domains/caregiverManagement/application/useCases/UpdateCaregiverContactUseCase.ts
import { ICaregiverRepo } from "../interfaces/ICaregiverRepo";
import { Email } from "../../domain/valueObjects/Email";
import { PhoneNumber } from "../../domain/valueObjects/PhoneNumber";
import { Caregiver } from "../../domain/entities/Caregiver";

export interface UpdateCaregiverContactInput {
  id: string;
  email: string;
  phone?: string | null;
}

export class UpdateCaregiverContactUseCase {
  constructor(private repo: ICaregiverRepo) {}

  public async execute(input: UpdateCaregiverContactInput): Promise<Caregiver> {
    const caregiver = await this.repo.getById(input.id);
    if (!caregiver) throw new Error("Caregiver not found");

    caregiver.changeContact(Email.create(input.email), PhoneNumber.create(input.phone ?? null));
    await this.repo.save(caregiver);
    return caregiver;
  }
}