// src/domains/taskManagement/application/useCases/ToggleChecklistItemUseCase.ts

import { ITaskRepo } from "../interfaces/ITaskRepo";
import { TaskMap } from "../../infrastructure/mappers/TaskMap";
import { TaskDTO } from "../dtos/TaskDTO";

export interface ToggleChecklistItemInput {
  taskId: string;
  itemId: string;
  done: boolean;
  byCaregiverId?: string | null;
}

export class ToggleChecklistItemUseCase {
  constructor(private readonly repo: ITaskRepo) {}

  public async execute(input: ToggleChecklistItemInput): Promise<{ task: TaskDTO }> {
    // 1. Fetch the Aggregate Root
    const task = await this.repo.getById(input.taskId);
    if (!task) {
      throw new Error(`Task with ID ${input.taskId} not found.`);
    }

    // 2. Delegate the mutation and its side-effects to the Domain
    task.toggleChecklistItem(input.itemId, input.done, input.byCaregiverId ?? null);

    // 3. Persist the updated aggregate via the unified Upsert pattern
    await this.repo.save(task);

    // 4. Safely extract and return the presentation layer payload
    return { task: TaskMap.toDTO(task) };
  }
}