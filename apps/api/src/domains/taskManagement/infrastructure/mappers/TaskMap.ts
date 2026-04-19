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
  assignedCaregiver:any;
  template?: TaskTemplate | null; // Necessary to get the 'title/name'
};

export class TaskMap {
  static toDomain(row: PrismaTaskWithRelations): Task {
    return Task.create({
      id: row.id,
      title: Title.create(row.title),
      description: row.description ? Description.create(row.description) : null,
      category: row.category,
      priority: row.priority,
      status: row.status,
      dueAt: row.dueAt,
      residentId: row.residentId,
      resident: row.resident ? {
        firstName: row.resident.firstName,
        lastName: row.resident.lastName,
      } : undefined,
      
      assignedCaregiverId: row.assignedCaregiverId,
      assignedCaregiver: row.assignedCaregiver ? {
        firstName: row.assignedCaregiver.user.firstName,
        lastName: row.assignedCaregiver.user.lastName,
      }: undefined,
      startedAt: row.startedAt ?? null,
      completedAt: row.completedAt ?? null,
      completedByCaregiverId: null,
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
      // Note: Persistence usually handles the Task model. 
      // If updating title, you'd likely update the associated Template or a custom field.
      id: task.id,
      title: task.title.value,
      description: task.description.value,
      category: task.category,
      priority: task.priority,
      status: task.status,
      residentId: task.residentId,
      dueAt: task.dueAt,
      startedAt: task.startedAt,
      completedAt: task.completedAt,
      assignedCaregiverId: task.assignedCaregiverId,
      completionNotes: task.completionNotes,
      checklist: {
        create: task.checklist.map(item => ({
          id: item.id,
          label: item.label,
          // Change 'required' to 'isRequired' (or whatever your schema says)
          isRequired: item.required,
          done: item.done,
          // ... other fields
        }))
      }
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
      assignedCaregiver: task.assignedCaregiver ? {
      firstName: task.assignedCaregiver.firstName,
      lastName:  task.assignedCaregiver.lastName,
    } : null,
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