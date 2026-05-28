// src/domains/staffManagement/application/useCases/CreateStaffProfileUseCase.ts
import { IStaffRepo } from "../interfaces/IStaffRepo";
import { Staff, EmploymentType, StaffRole } from "../../domain/entities/Staff";
import { Email } from "../../domain/valueObjects/Email";
import { PhoneNumber } from "../../domain/valueObjects/PhoneNumber";

export interface CreateStaffProfileInput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole; 
  employmentType: EmploymentType;
  hireDate: string;
  birthDate: string;
}

export class CreateStaffProfileUseCase {
  constructor(private repo: IStaffRepo) {}

  public async execute(input: CreateStaffProfileInput): Promise<Staff> {
    // 1. Guard against duplicate ID creation
    const existsById = await this.repo.getById(input.id);
    if (existsById) {
      throw new Error("A staff profile for this system ID already exists.");
    }

    // Guard against email conflicts
    const existsByEmail = await this.repo.getByEmail(input.email);
    if (existsByEmail) {
      throw new Error("Email already in use by another staff member.");
    }

    // 2. Safely Instantiate Value Objects
    const emailVO = Email.create(input.email);
    if (!emailVO) {
      throw new Error("Invalid email format.");
    }

    const phoneVO = PhoneNumber.create(input.phone)

    // 3. Create the Aggregate Root
    const staff = Staff.create({
      id: input.id,
      firstName: input.firstName,
      lastName: input.lastName,
      email: emailVO,
      phone: phoneVO,
      birthDate: new Date(input.birthDate),
      role: input.role,
      employmentType: input.employmentType,
      certifications: [],
      hireDate: new Date(input.hireDate),
    });

    // 4. Persist to the database
    await this.repo.create(staff);
    
    return staff;
  }
}