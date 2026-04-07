// src/domains/residentManagement/application/useCases/RegisterResidentUseCase.ts
import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Resident } from "../../../residentManagement/domain/entities/Resident";
import { MedicalRecordNumber } from "../../../residentManagement/domain/valueObjects/MedicalRecordNumber";
import { Email } from "../../../residentManagement/domain/valueObjects/Email";
import { PhoneNumber } from "../../../residentManagement/domain/valueObjects/PhoneNumber";
import { ResidentStatus } from "../../../../generated/prisma";
import { MobilityLevel, Gender} from "../../../../generated/prisma";

export interface RegisterResidentInput {
  mrn: string;
  firstName: string;
  lastName: string;
  mobilityLevel: MobilityLevel
  birthDate: Date;
  status: ResidentStatus;
  gender: Gender;
  agencyId: number
  email?: string | null;
  phone?: string | null;
  room?: string | null;
}

export class RegisterResidentUseCase {
  constructor(
    private repo: IResidentRepo,
  ) {}

  public async execute(input: RegisterResidentInput) {
    const exists = await this.repo.getByMRN(input.mrn);
    if (exists) throw new Error("MRN already exists");

   
    const resident = Resident.create({
      residentId: null,
      mrn: MedicalRecordNumber.create(input.mrn),
      firstName: input.firstName,
      lastName: input.lastName,
      birthDate: new Date(input.birthDate),
      gender: input.gender,
      email: Email.create(input.email ?? null),
      phone: PhoneNumber.create(input.phone ?? null),
      mobilityLevel: input.mobilityLevel,
      room: input.room ?? null,
      agencyId: input.agencyId,
      taskAssignments: [],
      tasks: [],
      status: ResidentStatus.ACTIVE,
      allergies: [],
      medications: [],
      emergencyContacts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.repo.create(resident);
    return resident;
  }
}