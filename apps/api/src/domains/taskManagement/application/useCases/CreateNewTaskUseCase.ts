// src/domains/taskManagement/application/useCases/CreateNewTaskUseCase.ts

import { ITaskRepo } from "../interfaces/ITaskRepo";
import { Task } from "../../domain/entities/Task";
import { Title } from "../../domain/valueObjects/Title";
import { Description } from "../../domain/valueObjects/Description";
import { ChecklistItem } from "../../domain/entities/ChecklistItem";
import { CreateTaskDTO } from "../dtos/TaskDTO";

export class CreateNewTaskUseCase {
  constructor(private repo: ITaskRepo) {}

  public async execute(input: CreateTaskDTO): Promise<Task> {
    // 1. Domain Object Construction
    const task = Task.create({
      title: Title.create(input.title),
      description: input.description ? Description.create(input.description) : null,
      category: input.category,
      priority: input.priority,
      residentId: input.residentId ?? null,
      assignedCaregiverId: input.assignedCaregiverId ?? null,
      createdByUserId: input.createdByUserId, // Now correctly handled
      completionNotes: [],
      // Map checklist items through their own domain factory
      checklist: (input.checklist ?? []).map(item => ChecklistItem.create({
        id: item.id,
        label: item.label,
        required: item.required ?? false
      })),
    });

    // 2. Persistence
    await this.repo.create(task);

    // 3. Return the Entity
    return task;
  }
}