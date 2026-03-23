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

  async list(): Promise<Caregiver[]> {
  const rows = await this.prisma.user.findMany({
    where: {
      // 1. Check that the roles array contains 'CAREGIVER'
      roles: { 
        has: 'CAREGIVER' 
      },
      // 2. Ensure the actual profile record exists to prevent mapping crashes
      caregiverProfile: {
        isNot: null
      }
    },
    include: { 
      caregiverProfile: true // Vital for CaregiverMap.toDomain to work
    },
  });

  // ADD THIS LOG:
  console.log("PRISMA ROWS:", rows);

  return rows.map(CaregiverMap.toDomain);
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