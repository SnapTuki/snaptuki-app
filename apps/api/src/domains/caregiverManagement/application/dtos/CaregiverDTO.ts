import { CaregiverRole } from "../../../../generated/prisma";
// src/domains/caregiverManagement/application/dtos/CaregiverDTO.ts
export interface CertificationDTO {
  id: string;
  name: string;
  issuer: string;
  validFrom: string;
  validTo: string | null;
}

export interface CaregiverDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone: string | null;
  role: CaregiverRole;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  hireDate: string;
  userId: string | null;
  certifications: CertificationDTO[];
  createdAt: string;
  updatedAt: string;
}