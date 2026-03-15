// src/domains/taskManagement/application/dtos/TaskDTO.ts
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
  category: "CARE" | "MEDICATION" | "HYGIENE" | "ADMIN" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

  residentId: string | null;
  assignedCaregiverId: string | null;

  startedAt: string | null;
  completedAt: string | null;
  completedByCaregiverId: string | null;
  completionNotes: string | null;

  checklist: ChecklistItemDTO[];

  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}