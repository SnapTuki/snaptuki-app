// src/domains/taskManagement/application/dtos/TaskDTO.ts

// 1. Import Enums strictly from the Domain!
import { TaskCategory, TaskPriority, TaskStatus } from "../../domain/entities/Task";

export interface ChecklistItemDTO {
  id: string;
  label: string;
  required: boolean;
  done: boolean;
  doneAt: Date | null; // Keep as Date for GraphQLDateTime compatibility
  doneByCaregiverId: string | null;
}

// Optional: Define strict nested types if you intend to return joined data
export interface TaskResidentDTO {
  id: string;
  firstName: string;
  lastName: string;
}

export interface TaskCaregiverDTO {
  id: string;
  firstName: string;
  lastName: string;
}

export interface TaskDTO {
  id: string;
  title: string;
  description: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;

  residentId: string;
  assignedCaregiverId: string;
  
  // Replace 'any' with strict shapes (or remove them if the GraphQL resolver fetches them separately)
  resident?: TaskResidentDTO | null;
  assignedCaregiver?: TaskCaregiverDTO | null;
  
  dueAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  completedByCaregiverId: string | null;
  completionNotes: string[] | null;

  checklist: ChecklistItemDTO[];

  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string | null;
  category?: TaskCategory; // Replaced 'any' with domain enum
  priority?: TaskPriority; // Replaced 'any' with domain enum
  residentId: string;
  assignedCaregiverId: string;
  dueAt: Date;
  createdByUserId: string;
  checklist?: Array<{ 
    // id is omitted here because the Use Case generates it securely!
    label: string; 
    required?: boolean; 
  }>;
}