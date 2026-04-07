// src/domains/caregiverManagement/application/useCases/RegisterCaregiverUseCase.ts
import { ICaregiverRepo } from "../interfaces/ICaregiverRepo";
import { Caregiver } from "../../domain/entities/Caregiver";
import { CaregiverRole } from "../../../../generated/prisma";

import { Email } from "../../domain/valueObjects/Email";
import { PhoneNumber } from "../../domain/valueObjects/PhoneNumber";


export class RegisterCaregiverUseCase {
  constructor(
    private repo: ICaregiverRepo,
  ) {}

  public async execute(input: any): Promise<Caregiver> {
    const exists = await this.repo.getByEmail(input.email);
    if (exists) throw new Error("Email already in use by another caregiver");

     const caregiver = Caregiver.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: Email.create(input.email),
      passwordHash: input.passwordHash,
      phone: PhoneNumber.create(input.phone ?? null),
      role: input.role,
      employmentType: input.employmentType,
      status: "ACTIVE",
      hireDate: new Date(input.hireDate),
      certifications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.repo.create(caregiver);
    return caregiver;
  }
}