// src/domains/taskManagement/infrastructure/mappers/TaskMap.ts
import { Task } from "../../../taskManagement/domain/entities/Task";
import { ChecklistItem } from "../../../taskManagement/domain/entities/ChecklistItem";
import { Title } from "../../../taskManagement/domain/valueObjects/Title";
import { Description } from "../../../taskManagement/domain/valueObjects/Description";
import { TaskDTO } from "../../../taskManagement/application/dtos/TaskDTO";
import type { Task as PrismaTask, ChecklistItem as PrismaChecklist } from "../../../../generated/prisma";

export class TaskMap {
  static toDomain(row: PrismaTask & { checklist: PrismaChecklist[] }): Task {
    return Task.create({
      id: row.id,
      title: Title.create(row.title),
      description: row.description ? Description.create(row.description) : null,
      category: row.category as any,
      priority: row.priority as any,
      status: row.status as any,
      residentId: row.residentId ?? null,
      assignedCaregiverId: row.assignedCaregiverId ?? null,
      startedAt: row.startedAt ?? null,
      completedAt: row.completedAt ?? null,
      completedByCaregiverId: row.completedByCaregiverId ?? null,
      completionNotes: row.completionNotes ?? null,
      checklist: row.checklist.map(ci => ChecklistItem.create({
        id: ci.id,
        label: ci.label,
        required: ci.required,
        done: ci.done,
        doneAt: ci.doneAt ?? null,
        doneByCaregiverId: ci.doneByCaregiverId ?? null
      })),
      createdByUserId: row.createdByUserId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(task: Task) {
    return {
      id: task.id,
      title: task.title.value,
      description: task.description?.value ?? null,
      category: task.category,
      priority: task.priority,
      status: task.status,
      residentId: task.residentId,
      assignedCaregiverId: task.assignedCaregiverId,
      startedAt: task.startedAt,
      completedAt: task.completedAt,
      completedByCaregiverId: task.completedByCaregiverId,
      completionNotes: task.completionNotes,
      createdByUserId: task.createdByUserId,
    };
  }

  static toDTO(task: Task): TaskDTO {
    return {
      id: task.id,
      title: task.title.value,
      description: task.description?.value ?? null,
      category: task.category,
      priority: task.priority,
      status: task.status,
      residentId: task.residentId,
      assignedCaregiverId: task.assignedCaregiverId,
      startedAt: task.startedAt ? task.startedAt.toISOString() : null,
      completedAt: task.completedAt ? task.completedAt.toISOString() : null,
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
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}