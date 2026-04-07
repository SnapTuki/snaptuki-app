// src/domains/caregiverManagement/application/useCases/CreateCaregiverProfileUseCase.ts
// Use this when a User already exists in IdentityAccess and you just need a Caregiver profile.
import { ICaregiverRepo } from "../interfaces/ICaregiverRepo";
import { Caregiver, EmploymentType } from "../../domain/entities/Caregiver";
import { Email } from "../../domain/valueObjects/Email";
import { PhoneNumber } from "../../domain/valueObjects/PhoneNumber";
import { CaregiverRole } from "../../../../generated/prisma";

export interface CreateCaregiverProfileInput {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  email: string;
  phone?: string | null;
  role: CaregiverRole;
  employmentType: EmploymentType;
  hireDate: string; // ISO
}

export class CreateCaregiverProfileUseCase {
  constructor(private repo: ICaregiverRepo) {}

  public async execute(input: CreateCaregiverProfileInput): Promise<Caregiver> {
    const exists = await this.repo.getByEmail(input.email);
    if (exists) throw new Error("Email already in use by another caregiver");

    const caregiver = Caregiver.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: Email.create(input.email),
      passwordHash: input.passwordHash,
      phone: PhoneNumber.create(input.phone ?? null),
      role: input.role,
      status: "ACTIVE",
      employmentType: input.employmentType,
      hireDate: new Date(input.hireDate),
      userId: input.userId,
      certifications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.repo.create(caregiver);
    return caregiver;
  }
}