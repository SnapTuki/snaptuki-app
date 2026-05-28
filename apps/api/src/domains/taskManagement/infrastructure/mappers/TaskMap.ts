// src/domains/taskManagement/infrastructure/mappers/TaskMap.ts

import { Task } from "../../domain/entities/Task";
import { ChecklistItem } from "../../domain/entities/ChecklistItem";
import { TaskDTO } from "../../application/dtos/TaskDTO";

// Domain Enums
import { TaskCategory, TaskPriority, TaskStatus } from "../../domain/entities/Task";

import type {
  Task as PrismaTask,
  ChecklistItem as PrismaChecklist,
} from "../../../../generated/prisma";

// Define the inclusion type for Prisma
type PrismaTaskWithRelations = PrismaTask & {
  checklist: PrismaChecklist[];
};

export class TaskMap {
  
  /**
   * 1. INFRASTRUCTURE -> DOMAIN (Read)
   */
  static toDomain(row: PrismaTaskWithRelations | null): Task | null {
    if (!row) return null;

    // Use the Rehydration Factory! Pass raw primitives.
    return Task.restore({
      id: row.id,
      title: row.title,
      description: row.description,
      
      // Cast Prisma enums to Domain enums
      category: row.category as unknown as TaskCategory,
      priority: row.priority as unknown as TaskPriority,
      status: row.status as unknown as TaskStatus,
      
      dueAt: row.dueAt,
      residentId: row.residentId,
      assignedCaregiverId: row.assignedStaffId,
      
      startedAt: row.startedAt,
      completedAt: row.completedAt,
      completedByCaregiverId: row.assignedStaffId ?? null,
      completionNotes: row.completionNotes ?? null,
      
      checklist: row.checklist.map(ci => ({
        id: ci.id,
        label: ci.label,
        isRequired: ci.isRequired, 
        isCompleted: ci.isCompleted, 
        completedAt: ci.completedAt, 
      })),
      
      createdByUserId: "system", // Or map from Prisma if added later
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  /**
   * 2. DOMAIN -> INFRASTRUCTURE (Write)
   */
  static toPersistence(task: Task) {
    // ONE call to get the un-encapsulated state of the Aggregate
    const state = task.snapshot();

    return {
      id: state.id,
      title: state.title, 
      description: state.description,
      category: state.category,
      priority: state.priority,
      status: state.status,
      residentId: state.residentId,
      assignedCaregiverId: state.assignedCaregiverId,
      dueAt: state.dueAt,
      startedAt: state.startedAt,
      completedAt: state.completedAt,
      completedByCaregiverId: state.completedByCaregiverId,
      completionNotes: state.completionNotes,
      
      // --- Nested Writes (The DDD Wipe & Replace Pattern) ---
      checklist: {
        deleteMany: {}, 
        create: state.checklist.map(item => ({
          id: item.id,
          label: item.label,
          isRequired: item.isRequired,
          isCompleted: item.isCompleted,
          completedAt: item.completedAt
        }))
      }
    };
  }

  /**
   * 3. DOMAIN -> PRESENTATION (API/GraphQL)
   */
  static toDTO(task: Task): TaskDTO {
    const state = task.snapshot();

    return {
      id: state.id,
      title: state.title,
      description: state.description,
      category: state.category,
      priority: state.priority,
      status: state.status,
      residentId: state.residentId,
      assignedCaregiverId: state.assignedCaregiverId,
      dueAt: state.dueAt,
      startedAt: state.startedAt,
      completedAt: state.completedAt,
      completedByCaregiverId: state.completedByCaregiverId,
      completionNotes: state.completionNotes,
      
      // State arrays already contain clean, plain objects!
      checklist: state.checklist.map(ci => ({
        id: ci.id,
        label: ci.label,
        required: ci.isRequired,
        done: ci.isCompleted,
        doneAt: ci.completedAt,
        doneByCaregiverId: ci.completedByCaregiverId,
      })),
      
      createdByUserId: state.createdByUserId,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
    };
  }
}