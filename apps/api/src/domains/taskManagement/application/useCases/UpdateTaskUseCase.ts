// src/domains/taskManagement/application/useCases/UpdateTaskUseCase.ts

import { ITaskRepo } from "../interfaces/ITaskRepo";
import { TaskPriority } from "../../domain/entities/Task";
import { TaskMap } from "../../infrastructure/mappers/TaskMap";
import { TaskDTO } from "../dtos/TaskDTO";

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  dueAt?: Date | null;
  assignedCaregiverId?: string | null;
}

export class UpdateTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepo) {}

  public async execute(input: UpdateTaskInput): Promise<{ task: TaskDTO }> {
    // 1. Fetch the Aggregate Root
    const task = await this.taskRepo.getById(input.id);
    if (!task) {
      throw new Error(`Task with ID ${input.id} not found.`);
    }

    // 2. Apply updates to the core scalar fields
    task.update({
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueAt: input.dueAt,
    });

    // 3. Trigger specific domain behaviors explicitly
    if (input.assignedCaregiverId !== undefined) {
      if (input.assignedCaregiverId === null) {
        task.unassign();
      } else {
        task.assign(input.assignedCaregiverId);
      }
    }

    // 4. Persist the updated aggregate via the unified Upsert pattern
    await this.taskRepo.save(task); 

    // 5. Safely transform and return the presentation layer payload
    return { task: TaskMap.toDTO(task) };
  }
}