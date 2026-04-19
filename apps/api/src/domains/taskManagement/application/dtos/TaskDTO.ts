// src/domains/taskManagement/application/dtos/TaskDTO.ts
import { TaskCategory, TaskPriority, TaskStatus } from "../../../../generated/prisma";
export interface ChecklistItemDTO {
  id: string;
  label: string;
  required: boolean;
  done: boolean;
  doneAt: string | null;
  doneByCaregiverId: string | null;
}

export interface TaskDTO {
  id: string;
  title: string;
  description: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;

  residentId: string | null;
  assignedCaregiverId: string | null;
  resident: any;
  assignedCaregiver: any;
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
  category: any; // Use your aliased TaskCategory
  priority: any; // Use your aliased TaskPriority
  residentId?: string | null;
  assignedCaregiverId?: string | null;
  dueAt?: Date | null;
  createdByUserId: string;
  checklist?: Array<{ id: string; label: string; required?: boolean }>;
}
