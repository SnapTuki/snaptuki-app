// src/domains/caregiverManagement/application/useCases/AddCaregiverCertificationUseCase.ts
import { ICaregiverRepo } from "../interfaces/ICaregiverRepo";
import { Certification } from "../../domain/entities/Certification";

export interface AddCaregiverCertificationInput {
  caregiverId: string;
  certId: string;
  name: string;
  issuer: string;
  validFrom: string; // ISO
  validTo?: string | null;
}

export class AddCaregiverCertificationUseCase {
  constructor(private repo: ICaregiverRepo) {}

  public async execute(input: AddCaregiverCertificationInput) {
    const caregiver = await this.repo.getById(input.caregiverId);
    if (!caregiver) throw new Error("Caregiver not found");

    const cert = Certification.create({
      id: input.certId,
      name: input.name,
      issuer: input.issuer,
      validFrom: new Date(input.validFrom),
      validTo: input.validTo ? new Date(input.validTo) : null,
    });

    caregiver.addCertification(cert);
    await this.repo.save(caregiver);
    return caregiver;
  }
}