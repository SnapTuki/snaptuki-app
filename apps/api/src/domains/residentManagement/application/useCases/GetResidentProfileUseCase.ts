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
      
      allergies: rawData.allergies.map((a: any) => ({
        id: a.id,
        name: a.name,
        reaction: a.reaction,
        severity: a.severity as any,
        notes: a.notes,
      })),
      
      medications: rawData.medications.map((m:any) => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        startDate: m.startDate,
        endDate: m.endDate,
        prescribedBy: m.prescribedBy,
      })),
      
      emergencyContacts: rawData.emergencyContacts.map((e:any) => ({
        id: e.id,
        name: e.name,
        relation: e.relation,
        phone: e.phone,
        isPrimary: e.isPrimary,
      })),

      createdAt: rawData.createdAt,
      updatedAt: rawData.updatedAt,
    };
  }
}