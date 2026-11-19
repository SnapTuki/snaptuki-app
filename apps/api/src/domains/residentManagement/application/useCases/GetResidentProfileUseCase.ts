// src/domains/residentManagement/application/useCases/GetResidentProfileUseCase.ts
import { ResidentDTO } from "../dtos/ResidentDTO";
import { IResidentRepo } from "../interfaces/IResidentRepo";

export class GetResidentProfileUseCase {
  // Inject Prisma directly for Read Operations to bypass Domain Repositories
  constructor(private readonly residentRepo: IResidentRepo) {}

  public async execute(residentId: string): Promise<ResidentDTO | null> {
    const rawData = await this.residentRepo.getById(residentId);

    if (!rawData) return null;

    // Map raw database rows directly to the Read DTO
    return {
      residentId: rawData.residentId,
      agencyId: rawData.agencyId,
      mrn: rawData.mrn,
      firstName: rawData.firstName,
      lastName: rawData.lastName,
      birthDate: rawData.birthDate,
      gender: rawData.gender as any, // Cast to rawDatayour Enum
      status: rawData.status as any,
      mobilityLevel: rawData.mobilityLevel as any,
      room: rawData.room,

      createdAt: rawData.createdAt,
      updatedAt: rawData.updatedAt,
    };
  }
}