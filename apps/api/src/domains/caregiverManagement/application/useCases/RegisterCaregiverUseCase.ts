// src/domains/caregiverManagement/application/useCases/RegisterCaregiverUseCase.ts
import { ICaregiverRepo } from "../interfaces/ICaregiverRepo";
import { Caregiver, EmploymentType, CaregiverRole } from "../../domain/entities/Caregiver";

import { CaregiverId } from "../../domain/valueObjects/CaregiverId";
import { Name } from "../../domain/valueObjects/Name";
import { Email } from "../../domain/valueObjects/Email";
import { PhoneNumber } from "../../domain/valueObjects/PhoneNumber";

export interface RegisterCaregiverInput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role: CaregiverRole;
  employmentType: EmploymentType;
  hireDate: string; // ISO
  agencyId?: number | null;
}

export class RegisterCaregiverUseCase {
  constructor(
    private repo: ICaregiverRepo,
  ) {}

  public async execute(input: RegisterCaregiverInput): Promise<Caregiver> {
    const exists = await this.repo.getByEmail(input.email);
    if (exists) throw new Error("Email already in use by another caregiver");

     const caregiver = Caregiver.create({
      id: CaregiverId.create(input.id),
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