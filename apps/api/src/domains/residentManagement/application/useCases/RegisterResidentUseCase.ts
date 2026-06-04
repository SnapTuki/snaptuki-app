// src/domains/residentManagement/application/useCases/RegisterResidentUseCase.ts

import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Resident, Gender, MobilityLevel } from "../../domain/entities/Resident";
import { MedicalRecordNumber } from "../../domain/valueObjects/MedicalRecordNumber";
import { Email } from "../../domain/valueObjects/Email";
import { EmergencyContact } from "../../domain/entities/EmergencyContact";
import { PhoneNumber } from "../../domain/valueObjects/PhoneNumber";
import { SSN } from "../../domain/valueObjects/SSN";
import { ResidentMap } from "../../infrastructure/prisma/mappers/ResidentMap";
import { ResidentDTO } from "../dtos/ResidentDTO"; // Ensure this matches your DTO path

export interface RegisterResidentInput {
  firstName: string;
  lastName: string;
  ssn: string;
  mobilityLevel: MobilityLevel;
  birthDate: string;
  gender: Gender;
  agencyId: number;
  emergencyContacts: EmergencyContactInput[];
  room?: string | null;
}

export interface EmergencyContactInput{
  id: string | null;
  name: string;
  phone: string;
  relation: string;
  email?: string | null;
}

export class RegisterResidentUseCase {
  constructor(
    private readonly repo: IResidentRepo,
  ) {}

  public async execute(input: RegisterResidentInput): Promise<{ resident: ResidentDTO }> {


    // 1. Generate ID upfront (The Clean Architecture way)
    const residentId = crypto.randomUUID();

    // 2. Generate MRN numner
    const generatedMrn = `MRN-${input.lastName.substring(0, 3).toUpperCase()}`;

    // 3.Create Emergency Contact object
    const emgContacts = input.emergencyContacts.map((c: EmergencyContactInput) => EmergencyContact.createNew({
      id: crypto.randomUUID(),
      name: c.name,
      relation: c.relation,
      phone: c.phone,
      email: c.email,
    }))
     

    
    // 3. Create the Aggregate Root
    const resident = Resident.createNew({
      residentId,
      agencyId: input.agencyId,
      mrn: MedicalRecordNumber.create(generatedMrn),
      firstName: input.firstName,
      lastName: input.lastName,
      ssn: SSN.create(input.ssn),
      birthDate: new Date(input.birthDate),
      gender: input.gender,
      mobilityLevel: input.mobilityLevel,
      room: input.room ?? null,
      emergencyContacts: emgContacts,
      
      // Note: We omit tasks, status, and timestamps because the domain 
      // factory (createNew) handles all of those defaults internally!
    });

    // 4. Persist using the unified upsert pattern
    await this.repo.save(resident);

    // 5. Return a safe Presentation DTO to the API/GraphQL layer
    return { resident: ResidentMap.toDTO(resident) };
  }
}