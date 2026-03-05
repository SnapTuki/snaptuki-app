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

  async list(params?: { take?: number; skip?: number; search?: string | null; role?: string | null; status?: string | null; }): Promise<Caregiver[]> {
    const { take = 10, skip = 0, search, role, status } = params ?? {};
    const rows = await this.prisma.user.findMany({
    where: {
      // Ensure we only pull Users that actually have a Caregiver profile
      caregiverProfile: { isNot: null },
      AND: [
        // Filter by Caregiver-specific Role
        role ? { caregiverProfile: { role: role as any } } : {},
        // Filter by Caregiver-specific Status
        status ? { caregiverProfile: { status: status as any } } : {},
        // Search across User-level identity fields
        search ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        } : {},
      ],
    },
    take,
    skip,
    orderBy: { createdAt: "desc" },
    include: { 
      caregiverProfile: true // Vital for CaregiverMap.toDomain to work
    },
  });
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
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            passwordHash: data.passwordHash
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