// src/domains/caregiverManagement/infrastructure/mappers/CaregiverMap.ts
import { Caregiver } from "../../domain/entities/Caregiver";
import { Certification } from "../../domain/entities/Certification";
import { Email } from "../../domain/valueObjects/Email";
import { PhoneNumber } from "../../domain/valueObjects/PhoneNumber";
import { CaregiverDTO } from "../../application/dtos/CaregiverDTO";
import type { User as PrismaCaregiver, Certification as PrismaCertification, Caregiver as PrismaCaregiverProfile } from "../../../../generated/prisma/client";

export class CaregiverMap {
  static toDomain(row: PrismaCaregiver & { certifications?: PrismaCertification[] } & {caregiverProfile: PrismaCaregiverProfile}): Caregiver {
    return Caregiver.create({
      firstName: row.firstName,
      lastName: row.lastName,
      caregiverProfile: row.caregiverProfile,
      email: Email.create(row.email),
      passwordHash: row.passwordHash,
      phone: row.caregiverProfile.phone ? PhoneNumber.create(row.caregiverProfile.phone) : null,
      role: row.caregiverProfile.role as any,
      status: row.caregiverProfile.status as any,
      employmentType: row.caregiverProfile.employmentType as any,
      hireDate: row.caregiverProfile.hireDate,
      userId: row.userId ?? null,
      certifications: row.certifications?.map(c =>
        Certification.create({
          id: c.id,
          name: c.name,
          issuer: c.issuer,
          validFrom: c.validFrom,
          validTo: c.validTo,
        })
      ),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(caregiver: Caregiver) {
    return {
      firstName: caregiver.firstName,
      lastName: caregiver.lastName,
      email: caregiver.email.value,
      passwordHash: caregiver.passwordHash,
      phone: caregiver.phone?.value ?? null,
      role: caregiver.role,
      status: caregiver.status,
      employmentType: caregiver.employmentType,
      hireDate: caregiver.hireDate,
      userId: caregiver.userId,
      certifications: caregiver.certifications?.map(c => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        validFrom: c.validFrom.toISOString(),
        validTo: c.validTo ? c.validTo.toISOString() : null,
      }))
    };
  }

  static toDTO(caregiver: Caregiver): CaregiverDTO {
    return {
      id: caregiver.caregiverProfile.id,
      firstName: caregiver.firstName,
      lastName: caregiver.lastName,
      email: caregiver.email.value,
      passwordHash: caregiver.passwordHash,
      phone: caregiver.phone?.value ?? null,
      role: caregiver.role,
      status: caregiver.status,
      employmentType: caregiver.employmentType,
      hireDate: caregiver.hireDate.toISOString(),
      userId: caregiver.userId,
      certifications: caregiver.certifications?.map(c => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        validFrom: c.validFrom.toISOString(),
        validTo: c.validTo ? c.validTo.toISOString() : null,
      })),
      createdAt: caregiver.createdAt.toISOString(),
      updatedAt: caregiver.updatedAt.toISOString(),
    };
  }
}