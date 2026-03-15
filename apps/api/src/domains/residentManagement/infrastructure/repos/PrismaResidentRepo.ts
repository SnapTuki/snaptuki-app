// src/domains/residentManagement/infrastructure/repos/PrismaResidentRepo.ts
import prisma from "../../../../prisma/client";
import { IResidentRepo } from "../../../residentManagement/application/interfaces/IResidentRepo";
import { Resident } from "../../../residentManagement/domain/entities/Resident";
import { ResidentMap } from "../mappers/ResidentMap";

export class PrismaResidentRepo implements IResidentRepo {
  async getById(id: string): Promise<Resident | null> {
    const row = await prisma.resident.findUnique({
      where: { residentId: id },
      include: { allergies: true, medications: true, emergencyContacts: true },
    });
    return row ? ResidentMap.toDomain(row) : null;
  }

  async getByMRN(mrn: string): Promise<Resident | null> {
    const row = await prisma.resident.findUnique({
      where: { mrn },
      include: { allergies: true, medications: true, emergencyContacts: true },
    });
    return row ? ResidentMap.toDomain(row) : null;
  }

  async list(params?: { take?: number; skip?: number; search?: string | null; status?: string | null; mobilityLevel?: string | null; }): Promise<Resident[]> {
    const { take = 50, skip = 0, search, status, mobilityLevel } = params ?? {};
    const rows = await prisma.resident.findMany({
      where: {
        AND: [
          mobilityLevel ? { mobilityLevel: mobilityLevel as any } : {},
          search
            ? {
                OR: [
                  { firstName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                  { mrn: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      take,
      skip,
      orderBy: { createdAt: "desc" },
      include: { allergies: true, medications: true, emergencyContacts: true },
    });
    return rows.map(ResidentMap.toDomain);
  }

  async create(resident: Resident): Promise<void> {
    const data = ResidentMap.toPersistence(resident);
    await prisma.resident.create({ data });
  }

  async save(resident: Resident): Promise<void> {
    const data = ResidentMap.toPersistence(resident);
    await prisma.resident.update({
      where: { residentId: resident.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.resident.delete({ where: { residentId: id } });
  }
}