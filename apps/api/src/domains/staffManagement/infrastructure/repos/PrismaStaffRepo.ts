// src/domains/caregiverManagement/infrastructure/repos/PrismaCaregiverRepo.ts
import { PrismaClient } from "../../../../generated/prisma";
import { IStaffRepo } from "../../application/interfaces/IStaffRepo";
import { Staff } from "../../domain/entities/Staff";
import { StaffMap } from "../mappers/StaffMaps";

export class PrismaStaffRepo implements IStaffRepo {

  constructor(private readonly prisma: PrismaClient) { }

  async getById(id: string): Promise<Staff | null> {
    const row = await this.prisma.staff.findUnique({
      where: { id: id },
    });
    return row ? StaffMap.toDomain(row) : null;
  }

  async getByEmail(email: string): Promise<Staff | null> {
    const row = await this.prisma.staff.findUnique({
      where: { email: email.toLowerCase() },
      
    });
    return row ? StaffMap.toDomain(row) : null;
  }

  async list(params?: { search?: string | null }): Promise<Staff[]> {
  const { search } = params ?? {};

  const users = await this.prisma.staff.findMany({
    where: {
      OR: search ? [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ] : undefined,
    },
  });

  return users.map(StaffMap.toDomain);
}

  async create(staff: Staff): Promise<void> {
    const data = StaffMap.toPersistence(staff);
    await this.prisma.staff.create({
      data: {
        id: data.id,
        employmentType: data.employmentType,
        hireDate: data.hireDate,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        role: data.role,
      }
    });
  }

  async save(staff: Staff): Promise<void> {
    const rawData = StaffMap.toPersistence(staff);

    const {certifications, ...staffData} = rawData;

    await this.prisma.staff.update({
      where: { id: staffData.id },
      data: {
        ...staffData,
        certifications: {
          deleteMany: {},
          create: certifications
        }
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.staff.delete({ where: { id } });
  }
}