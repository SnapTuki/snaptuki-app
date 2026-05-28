// src/domains/residentManagement/application/useCases/RegisterResidentUseCase.ts

import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Resident, Gender, MobilityLevel } from "../../domain/entities/Resident";
import { MedicalRecordNumber } from "../../domain/valueObjects/MedicalRecordNumber";
import { Email } from "../../domain/valueObjects/Email";
import { PhoneNumber } from "../../domain/valueObjects/PhoneNumber";
import { ResidentMap } from "../../infrastructure/mappers/ResidentMap";
import { ResidentDTO } from "../dtos/ResidentDTO"; // Ensure this matches your DTO path

export interface RegisterResidentInput {
  mrn: string;
  firstName: string;
  lastName: string;
  mobilityLevel: MobilityLevel;
  birthDate: Date;
  gender: Gender;
  agencyId: number;
  email?: string | null;
  phone?: string | null;
  room?: string | null;
}

export class RegisterResidentUseCase {
  constructor(
    private readonly repo: IResidentRepo,
  ) {}

  public async execute(input: RegisterResidentInput): Promise<{ resident: ResidentDTO }> {
    
    // 1. Enforce Domain Rules / Uniqueness
    const exists = await this.repo.getByMRN(input.mrn);
    if (exists) {
        throw new Error(`Resident with MRN ${input.mrn} already exists.`);
    }

    // 2. Generate ID upfront (The Clean Architecture way)
    const residentId = crypto.randomUUID();

    // 3. Create the Aggregate Root
    const resident = Resident.createNew({
      residentId,
      agencyId: input.agencyId,
      mrn: MedicalRecordNumber.create(input.mrn),
      firstName: input.firstName,
      lastName: input.lastName,
      birthDate: new Date(input.birthDate),
      gender: input.gender,
      mobilityLevel: input.mobilityLevel,
      room: input.room ?? null,
      
      // Safely instantiate Value Objects only if data is provided
      email: input.email ? Email.create(input.email) : null,
      phone: input.phone ? PhoneNumber.create(input.phone) : null,
      
      // Note: We omit tasks, status, and timestamps because the domain 
      // factory (createNew) handles all of those defaults internally!
    });

    // 4. Persist using the unified upsert pattern
    await this.repo.save(resident);

    // 5. Return a safe Presentation DTO to the API/GraphQL layer
    return { resident: ResidentMap.toDTO(resident) };
  }
}