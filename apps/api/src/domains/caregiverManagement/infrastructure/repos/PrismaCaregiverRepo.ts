// src/domains/caregiverManagement/infrastructure/repos/PrismaCaregiverRepo.ts
import { PrismaClient } from "../../../../generated/prisma";
import { ICaregiverRepo } from "../../application/interfaces/ICaregiverRepo";
import { Caregiver } from "../../domain/entities/Caregiver";
import { CaregiverMap } from "../mappers/CaregiverMap";

export class PrismaCaregiverRepo implements ICaregiverRepo {

  constructor(private readonly prisma: PrismaClient) { }

  async getById(id: string): Promise<Caregiver | null> {
    const row = await this.prisma.user.findUnique({
      where: { userId: id },
      include: { caregiverProfile: true },
    });
    return row ? CaregiverMap.toDomain(row) : null;
  }

  async getByEmail(email: string): Promise<Caregiver | null> {
    const row = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {caregiverProfile: true},
      
    });
    return row ? CaregiverMap.toDomain(row) : null;
  }

  async list(params?: { search?: string | null }): Promise<Caregiver[]> {
  const { search } = params ?? {};

  const users = await this.prisma.user.findMany({
    where: {
      // 1. Ensure the user IS a caregiver
      caregiverProfile: { isNot: null },
      
      // 2. Apply name filters
      OR: search ? [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ] : undefined,
    },
    // 3. Include the profile data (the link to the Caregiver table)
    include: {
      caregiverProfile: true,
    },
  });

  return users.map(CaregiverMap.toDomain);
}

  async create(caregiver: Caregiver): Promise<void> {
    const data = CaregiverMap.toPersistence(caregiver);
    await this.prisma.caregiver.create({
      data: {
        role: data.role,
        employmentType: data.employmentType,
        hireDate: data.hireDate,
        user: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            passwordHash: data.passwordHash,
            roles: ['CAREGIVER']
          }
        }
      }
    });
  }

  async save(caregiver: Caregiver): Promise<void> {
    const data = CaregiverMap.toPersistence(caregiver);
    await this.prisma.user.update({
      where: { userId: caregiver.userId },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.caregiver.delete({ where: { id } });
  }
}