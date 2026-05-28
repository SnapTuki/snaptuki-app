import { StaffRole } from "../../domain/entities/Staff";
import { EmploymentType } from "../../domain/entities/Staff";
// src/domains/caregiverManagement/application/dtos/CaregiverDTO.ts
export interface CertificationDTO {
  id: string;
  name: string;
  issuer: string;
  validFrom: Date;
  validTo: Date | null;
}

export interface CaregiverDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone: string | null;
  role: StaffRole;
  employmentType: EmploymentType;
  hireDate: Date;
  userId: string | null;
  certifications: CertificationDTO[];
  createdAt: Date;
  updatedAt: Date;
}