import { 

  TaskStatus, 
  TaskPriority, 
  TaskCategory 
} from "../../../../generated/prisma";
import { Gender, MobilityLevel, ResidentStatus } from "../../domain/entities/Resident";
// --- Nested DTOs ---

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
  startDate: Date; 
  endDate: Date | null;
  prescribedBy: string | null;
}

export interface EmergencyContactDTO {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean; // Updated from 'email' to match schema 'is_primary'
}

export interface TaskAssignmentDTO {
  id: number;
  isActive: boolean;
  taskTemplate: {
    id: number;
    name: string;
    category?: TaskCategory;
    priority?: TaskPriority;
  };
}

export interface TaskHistoryDTO {
  id: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueAt: Date;
  completedAt: Date | null;
  completionNotes: string | null;
  checklist: Array<{
    label: string;
    isCompleted: boolean;
  }>;
}

// --- Main Resident DTO ---

export interface ResidentDTO {
  residentId: string;
  agencyId: number; // Added for Multi-tenancy context
  mrn: string;
  firstName: string;
  lastName: string;
  birthDate: Date; // ISO String
  gender: Gender;
  email: string | null;
  phone: string | null;

  mobilityLevel: MobilityLevel;
  room: string | null;
  status: ResidentStatus;
  
  primaryCaregiverId?: string | null;

  // Nested Collections
  allergies: AllergyDTO[];
  medications: MedicationDTO[];
  emergencyContacts: EmergencyContactDTO[];
  
  // Care Plan & History (New)
  taskAssignments: TaskAssignmentDTO[];
  tasks: TaskHistoryDTO[];

  createdAt: Date;
  updatedAt: Date;
}