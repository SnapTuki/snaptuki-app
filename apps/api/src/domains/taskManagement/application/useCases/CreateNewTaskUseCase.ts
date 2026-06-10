// src/domains/taskManagement/application/useCases/CreateNewTaskUseCase.ts

import { ITaskRepo } from "../interfaces/ITaskRepo";
import { Task } from "../../domain/entities/Task";
import { ChecklistItem } from "../../domain/entities/ChecklistItem";
import { TaskMap } from "../../infrastructure/mappers/TaskMap";
import { CreateTaskDTO, TaskDTO } from "../dtos/TaskDTO";

export class CreateNewTaskUseCase {
  constructor(private readonly repo: ITaskRepo) {}

  public async execute(input: CreateTaskDTO): Promise<{ task: TaskDTO }> {
    // 1. Generate Application-Level Identity
    const taskId = crypto.randomUUID();

    // 2. Delegate object construction to the strict Domain Factory
    const task = Task.createNew({
      id: taskId,
      title: input.title, // Raw string; factory handles Value Object wrapping
      description: input.description,
      category: input.category,
      priority: input.priority,
      residentId: input.residentId,
      dueAt: input.dueAt,
      createdByUserId: input.createdByUserId,
      assignedCaregiverId: input.assignedCaregiverId,
      // Map checklist items safely, generating IDs for them
      checklist: (input.checklist ?? []).map(item => ChecklistItem.createNew({
        id: crypto.randomUUID(), 
        label: item.label,
      })),
    });

    // 3. Handle Auto-Assignment logic securely via domain behavior
    if (input.assignedCaregiverId) {
      task.assign(input.assignedCaregiverId);
    }

    // 4. Persistence via the unified Upsert pattern
    await this.repo.save(task);

    // 5. Transform and safely return the presentation layer payload
    return { task: TaskMap.toDTO(task) };
  }
}