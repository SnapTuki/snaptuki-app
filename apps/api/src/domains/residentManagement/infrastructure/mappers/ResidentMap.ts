// src/domains/residentManagement/infrastructure/mappers/ResidentMap.ts
import { Resident } from "../../../residentManagement/domain/entities/Resident";
import { MedicalRecordNumber } from "../../../residentManagement/domain/valueObjects/MedicalRecordNumber";
import { Email } from "../../../residentManagement/domain/valueObjects/Email";
import { PhoneNumber } from "../../../residentManagement/domain/valueObjects/PhoneNumber";
import { Allergy } from "../../../residentManagement/domain/entities/Allergy";
import { Medication } from "../../../residentManagement/domain/entities/Medication";
import { EmergencyContact } from "../../../residentManagement/domain/entities/EmergencyContact";
import { ResidentDTO } from "../../../residentManagement/application/dtos/ResidentDTO";
import { TaskAssignment } from "../../domain/entities/TaskAssignment";
import { Task } from "../../domain/entities/Task";
import { ChecklistItem } from "../../domain/entities/ChecklistItem";
import { ActionRecord } from "../../domain/valueObjects/ActionRecord";
import { toDomainGender } from "./GenderMap";
import { toDomainResidentStatus } from "./ResidentStatusMap";
import { toDomainMobilityLevel } from "./MobilityLevelMap";
import type { Resident as PrismaResident, 
  Allergy as PrismaAllergy, 
  Medication as PrismaMedication, 
  EmergencyContact as PrismaEC,
  ResidentTaskAssignment as PrismaTaskAssignment,
  TaskTemplate as PrismaTaskTemplate,
  Task as PrismaTask,
  ChecklistItem as PrismaChecklistItem,
  ActionRecord as PrismaActionRecord 
 } from "../../../../generated/prisma";

export class ResidentMap {
  static toDomain(row: PrismaResident & { allergies?: PrismaAllergy[];
  medications?: PrismaMedication[];
  emergencyContacts?: PrismaEC[];
  taskAssignments?: (PrismaTaskAssignment & { taskTemplate: PrismaTaskTemplate })[];
  tasks?: (PrismaTask & { checklist: PrismaChecklistItem[]; actionRecords: PrismaActionRecord[] })[]; }): Resident {
    return Resident.create({
    residentId: row.residentId,
    agencyId: row.agencyId,
    mrn: MedicalRecordNumber.create(row.mrn),
    firstName: row.firstName,
    lastName: row.lastName,
    birthDate: row.birthDate,
    gender: toDomainGender(row.gender),
    email: row.email ? Email.create(row.email) : null,
    phone: row.phone ? PhoneNumber.create(row.phone) : null,
    status: toDomainResidentStatus(row.status),
    mobilityLevel: toDomainMobilityLevel(row.mobilityLevel),
    room: row.room ?? null,

    // --- Identity & Clinical Mapping ---
    allergies: row.allergies?.map(a => Allergy.create({
      id: a.id, 
      name: a.name, 
      reaction: a.reaction, 
      severity: a.severity as any,
      notes: a.notes ?? null
    })) ?? [],

    medications: row.medications?.map(m => Medication.create({
      id: m.id, 
      name: m.name, 
      dosage: m.dosage, 
      frequency: m.frequency, 
      startDate: m.startDate, 
      endDate: m.endDate ?? null, 
      prescribedBy: m.prescribedBy ?? null
    })) ?? [],

    emergencyContacts: row.emergencyContacts?.map(ec => EmergencyContact.create({
      id: ec.id, 
      name: ec.name, 
      relation: ec.relation, 
      phone: PhoneNumber.create(ec.phone),
      isPrimary: ec.isPrimary
    })) ?? [],

    // --- Care Plan (Task Assignments) ---
    taskAssignments: row.taskAssignments?.map(ta => TaskAssignment.rebuild({
      id: ta.id,
      residentId: ta.residentId,
      taskTemplateId: ta.taskTemplateId,
      isActive: ta.isActive,
      createdAt: ta.createdAt,
      taskTemplate: {
        name: ta.taskTemplate.name,
        category: ta.taskTemplate.category
      }
    })) ?? [],

    // --- Care History (Tasks & Results) ---
    tasks: row.tasks?.map(t => Task.rebuild({
      id: t.id,
      templateId: t.templateId,
      residentId: t.residentId,
      visitId: t.visitId,
      status: t.status,
      priority: t.priority,
      category: t.category,
      dueAt: t.dueAt,
      startedAt: t.startedAt,
      completedAt: t.completedAt,
      //completionNotes: t.completionNotes,
      checklist: t.checklist.map(c => new ChecklistItem({
        id: c.id,
        label: c.label,
        isRequired: c.isRequired,
        isCompleted: c.isCompleted,
        completedAt: c.completedAt
      })),
      actionRecords: t.actionRecords.map(ar => ActionRecord.rebuild({
        id: ar.id,
        taskId: ar.taskId,
        caregiverId: ar.caregiverId,
        value: ar.value,
        notes: ar.notes,
        createdAt: ar.createdAt
      }))
    })) ?? [],

    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
  }

  static toPersistence(resident: Resident) {
    return {
      agencyId: resident.agencyId,
      mrn: resident.mrn.value,
      firstName: resident.firstName,
      lastName: resident.lastName,
      birthDate: resident.birthDate,
      gender: resident.gender,
      email: resident.email?.value ?? null,
      phone: resident.phone?.value ?? null,
      status: resident.status,
      mobilityLevel: resident.mobilityLevel,
      room: resident.room,

      emergencyContacts: {
      // In a Purist approach, we often "overwrite" the collection 
      // to ensure the DB perfectly matches the Domain Entity state.
      deleteMany: {}, 
      create: resident.emergencyContacts.map(ec => ({
        name: ec.name,
        relation: ec.relation,
        phone: ec.phone.value,
        isPrimary: ec.isPrimary ?? false
      }))
    },
    };
  }

  static toDTO(resident: Resident): ResidentDTO {
  return {
    residentId: resident.residentId,
    agencyId: resident.agencyId,
    mrn: resident.mrn.value,
    firstName: resident.firstName,
    lastName: resident.lastName,
    birthDate: resident.birthDate,
    gender: resident.gender,
    email: resident.email?.value ?? null,
    phone: resident.phone?.value ?? null,
    status: resident.status,
    mobilityLevel: resident.mobilityLevel,
    room: resident.room,

    // --- Nested Collections ---
    allergies: resident.allergies.map(a => ({
      id: a.id, 
      name: a.name, 
      reaction: a.reaction, 
      severity: a.severity, 
      notes: a.notes
    })),

    medications: resident.medications.map(m => ({
      id: m.id, 
      name: m.name, 
      dosage: m.dosage, 
      frequency: m.frequency,
      startDate: m.startDate,
      endDate: m.endDate ? m.endDate : null,
      prescribedBy: m.prescribedBy,
    })),

    emergencyContacts: resident.emergencyContacts.map(ec => ({
      id: ec.id, 
      name: ec.name, 
      relation: ec.relation, 
      phone: ec.phone.value, 
      isPrimary: ec.isPrimary ?? false,
    })),

    // --- Care Plan (The Rules) ---
    taskAssignments: resident.taskAssignments.map(ta => ({
      id: ta.id,
      isActive: ta.isActive,
      taskTemplate: {
        id: ta.taskTemplateId,
        name: ta.templateName ?? 'Unknown Template', // Fallback if template details aren't loaded

      }
    })),

    // --- Care History (The Execution) ---
    // If you've stored a collection of recent Tasks in the Resident Aggregate Root
    tasks: resident.tasks.map(t => ({
      id: t.id,
      status: t.status,
      priority: t.priority,
      category: t.category,
      dueAt: t.dueAt,
      completedAt: t.completedAt?? null,
      completionNotes: t.completionNotes,
      checklist: t.checklist.map(c => ({
        label: c.label,
        isCompleted: c.isCompleted
      }))
    })) ?? [],

    createdAt: resident.createdAt,
    updatedAt: resident.updatedAt,
  };
}
}