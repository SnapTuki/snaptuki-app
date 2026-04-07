// src/domains/taskManagement/infrastructure/mappers/TaskMap.ts
import { Task } from "../../../taskManagement/domain/entities/Task";
import { ChecklistItem } from "../../../taskManagement/domain/entities/ChecklistItem";
import { Title } from "../../../taskManagement/domain/valueObjects/Title";
import { Description } from "../../../taskManagement/domain/valueObjects/Description";
import { TaskDTO } from "../../../taskManagement/application/dtos/TaskDTO";
// Note: Adjusted imports to match your Prisma generated client
import type {
  Task as PrismaTask,
  ChecklistItem as PrismaChecklist,
  TaskTemplate
} from "../../../../generated/prisma";

// Defining the inclusion type for Prisma
type PrismaTaskWithRelations = PrismaTask & {
  checklist: PrismaChecklist[];
  resident?: any;
  template?: TaskTemplate | null; // Necessary to get the 'title/name'
};

export class TaskMap {
  static toDomain(row: PrismaTaskWithRelations): Task {
    return Task.create({
      id: row.id,
      // In your schema, 'name' lives on the Template. 
      // If ad-hoc tasks have a custom title, ensure your Domain Entity handles this fallback.
      title: Title.create(row.template?.name || "Ad-hoc Task"),
      description: row.template?.description ? Description.create(row.template.description) : null,
      category: row.category,
      priority: row.priority,
      status: row.status,
      residentId: row.residentId,
      resident: row.resident ? {
        firstName: row.resident.firstName,
        lastName: row.resident.lastName,
      } : undefined,
      // Note: Your schema uses 'visitId' to link to a caregiver via 'Visit'
      // If your domain expects 'assignedCaregiverId', you'll need to map row.visit?.caregiverId
      assignedCaregiverId: null,
      startedAt: row.startedAt ?? null,
      completedAt: row.completedAt ?? null,
      // Schema uses 'completionNotes', not 'completedByCaregiverId' directly on Task
      completedByCaregiverId: null,
      completionNotes: row.completionNotes ?? null,
      checklist: row.checklist.map(ci => ChecklistItem.create({
        id: ci.id,
        label: ci.label,
        required: ci.isRequired, // Schema: isRequired
        done: ci.isCompleted,    // Schema: isCompleted
        doneAt: ci.completedAt ?? null, // Schema: completedAt
        doneByCaregiverId: null  // Not in your Prisma ChecklistItem model
      })),
      // Schema doesn't have createdByUserId on Task; consider adding it to Prisma or mapping from Audit
      createdByUserId: "system",
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(task: Task) {
    return {
      id: task.id,
      // Note: Persistence usually handles the Task model. 
      // If updating title, you'd likely update the associated Template or a custom field.
      category: task.category,
      priority: task.priority,
      status: task.status,
      residentId: task.residentId,
      dueAt: new Date(), // Required in Prisma Schema
      startedAt: task.startedAt,
      completedAt: task.completedAt,
      completionNotes: task.completionNotes,
      // visitId: task.visitId // You'll need this to link to a caregiver
    };
  }

  static toDTO(task: Task): TaskDTO {
    return {
      id: task.id,
      title: task.title.value,
      dueAt: task.dueAt ? task.dueAt : null,
      description: task.description?.value ?? null,
      category: task.category,
      priority: task.priority,
      status: task.status,
      residentId: task.residentId,
      resident: task.resident,
      assignedCaregiverId: task.assignedCaregiverId,
      startedAt: task.startedAt ? task.startedAt : null,
      completedAt: task.completedAt ? task.completedAt : null,
      completedByCaregiverId: task.completedByCaregiverId,
      completionNotes: task.completionNotes,
      checklist: task.checklist.map(ci => ({
        id: ci.id,
        label: ci.label,
        required: ci.required,
        done: ci.done,
        doneAt: ci.doneAt ? ci.doneAt.toISOString() : null,
        doneByCaregiverId: ci.doneByCaregiverId,
      })),
      createdByUserId: task.createdByUserId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}