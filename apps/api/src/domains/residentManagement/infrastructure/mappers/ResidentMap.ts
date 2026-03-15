// src/domains/residentManagement/infrastructure/mappers/ResidentMap.ts
import { Resident } from "../../../residentManagement/domain/entities/Resident";
import { MedicalRecordNumber } from "../../../residentManagement/domain/valueObjects/MedicalRecordNumber";
import { Email } from "../../../residentManagement/domain/valueObjects/Email";
import { PhoneNumber } from "../../../residentManagement/domain/valueObjects/PhoneNumber";
import { Allergy } from "../../../residentManagement/domain/entities/Allergy";
import { Medication } from "../../../residentManagement/domain/entities/Medication";
import { EmergencyContact } from "../../../residentManagement/domain/entities/EmergencyContact";
import { ResidentDTO } from "../../../residentManagement/application/dtos/ResidentDTO";
import type { Resident as PrismaResident, Allergy as PrismaAllergy, Medication as PrismaMedication, EmergencyContact as PrismaEC } from "../../../../generated/prisma/client";

export class ResidentMap {
  static toDomain(row: PrismaResident & { allergies: PrismaAllergy[]; medications: PrismaMedication[]; emergencyContacts: PrismaEC[] }): Resident {
    return Resident.create({
      id: row.residentId,
      mrn: MedicalRecordNumber.create(row.mrn),
      firstName: row.firstName,
      lastName: row.lastName,
      birthDate: row.birthDate,
      gender: row.gender,
      email: row.email ? Email.create(row.email) : null,
      phone: row.phone ? PhoneNumber.create(row.phone) : null,
    
      mobilityLevel: row.mobilityLevel,
      room: row.room ?? null,
      primaryCaregiverId: row.primaryCaregiverId ?? null,
      guardianUserId: row.guardianUserId ?? null,
      allergies: row.allergies.map(a => Allergy.create({
        id: a.id, name: a.name, reaction: a.reaction, severity: a.severity as any, notes: a.notes ?? null
      })),
      medications: row.medications.map(m => Medication.create({
        id: m.id, name: m.name, dosage: m.dosage, frequency: m.frequency, startDate: m.startDate, endDate: m.endDate ?? null, prescribedBy: m.prescribedBy ?? null
      })),
      emergencyContacts: row.emergencyContacts.map(ec => EmergencyContact.create({
        id: ec.id, name: ec.name, relation: ec.relation, phone: ec.phone, email: ec.email ?? null, preferred: ec.preferred
      })),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(resident: Resident) {
    return {
      residentId: resident.id,
      mrn: resident.mrn.value,
      firstName: resident.firstName,
      lastName: resident.lastName,
      birthDate: resident.birthDate,
      gender: resident.gender,
      email: resident.email?.value ?? null,
      phone: resident.phone?.value ?? null,
     
      mobilityLevel: resident.mobilityLevel,
      room: resident.room,
      primaryCaregiverId: resident.primaryCaregiverId,
      guardianUserId: resident.guardianUserId,
    };
  }

  static toDTO(resident: Resident): ResidentDTO {
    return {
      id: resident.id,
      mrn: resident.mrn.value,
      firstName: resident.firstName,
      lastName: resident.lastName,
      birthDate: resident.birthDate.toISOString(),
      gender: resident.gender,
      email: resident.email?.value ?? null,
      phone: resident.phone?.value ?? null,
      
      mobilityLevel: resident.mobilityLevel,
      room: resident.room,
      primaryCaregiverId: resident.primaryCaregiverId,
      guardianUserId: resident.guardianUserId,
      allergies: resident.allergies.map(a => ({
        id: a.id, name: a.name, reaction: a.reaction, severity: a.severity, notes: a.notes
      })),
      medications: resident.medications.map(m => ({
        id: m.id, name: m.name, dosage: m.dosage, frequency: m.frequency,
        startDate: m.startDate.toISOString(),
        endDate: m.endDate ? m.endDate.toISOString() : null,
        prescribedBy: m.prescribedBy,
      })),
      emergencyContacts: resident.emergencyContacts.map(ec => ({
        id: ec.id, name: ec.name, relation: ec.relation, phone: ec.phone.value, email: ec.email?.value ?? null, preferred: ec.preferred
      })),
      createdAt: resident.createdAt.toISOString(),
      updatedAt: resident.updatedAt.toISOString(),
    };
  }
}