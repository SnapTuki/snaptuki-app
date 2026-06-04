// src/domains/residentManagement/application/useCases/UpdateResidentIdentityUseCase.ts

import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Gender } from "../../domain/entities/Resident";
import { ResidentMap } from "../../infrastructure/prisma/mappers/ResidentMap";
import { ResidentDTO } from "../dtos/ResidentDTO";

export interface UpdateResidentIdentityInput {
  residentId: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  gender?: Gender;
}

export class UpdateResidentIdentityUseCase {
  constructor(private readonly repo: IResidentRepo) {}

  public async execute(request: UpdateResidentIdentityInput): Promise<{ resident: ResidentDTO }> {
    // 1. Fetch the Aggregate Root
    const resident = await this.repo.getById(request.residentId);
    if (!resident) {
      throw new Error("Resident not found");
    }

    // 2. Delegate mutation and business rule validation to the Aggregate Root
    resident.updateIdentity({
      firstName: request.firstName,
      lastName: request.lastName,
      birthDate: request.birthDate ? new Date(request.birthDate) : undefined,
      gender: request.gender
    });

    // 3. Persist the updated aggregate state
    await this.repo.save(resident);

    // 4. Safely return the plain presentation data layer payload
    return { resident: ResidentMap.toDTO(resident) };
  }
}