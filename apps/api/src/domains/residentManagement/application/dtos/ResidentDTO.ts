// src/domains/residentManagement/application/dtos/ResidentDTO.ts
export interface AllergyDTO {
  id: string;
  name: string;
  reaction: string;
  severity: "MILD" | "MODERATE" | "SEVERE";
  notes: string | null;
}

export interface MedicationDTO {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  prescribedBy: string | null;
}

export interface EmergencyContactDTO {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string | null;
}

export interface ResidentDTO {
  residentId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";
  email: string | null;
  phone: string | null;

  mobilityLevel: "INDEPENDENT" | "ASSISTED" | "MEMORY";
  room: string | null;

  primaryCaregiverId: string | null;
  guardianUserId: string | null;

  allergies: AllergyDTO[];
  medications: MedicationDTO[];
  emergencyContacts: EmergencyContactDTO[];

  createdAt: string;
  updatedAt: string;
}