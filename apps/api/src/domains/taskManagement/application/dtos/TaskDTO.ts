// src/domains/taskManagement/application/dtos/TaskDTO.ts
import { TaskCategory, TaskPriority, TaskStatus } from "../../../../generated/prisma";
import { Resident } from "../../../residentManagement/domain/entities/Resident";
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
  resident: Resident;
  dueAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  completedByCaregiverId: string | null;
  completionNotes: string | null;

  checklist: ChecklistItemDTO[];

  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}