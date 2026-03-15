// src/domains/taskManagement/application/useCases/ToggleChecklistItemUseCase.ts
import { ITaskRepo } from "../interfaces/ITaskRepo";
import { Task } from "../../../taskManagement/domain/entities/Task";

export interface ToggleChecklistItemInput {
  taskId: string;
  itemId: string;
  done: boolean;
  byCaregiverId?: string | null;
}

export class ToggleChecklistItemUseCase {
  constructor(private repo: ITaskRepo) {}

  public async execute(input: ToggleChecklistItemInput): Promise<Task> {
    const task = await this.repo.getById(input.taskId);
    if (!task) throw new Error("Task not found");

    task.toggleChecklistItem(input.itemId, input.done, input.byCaregiverId ?? null);
    await this.repo.save(task);
    return task;
  }
}