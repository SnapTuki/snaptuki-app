// src/domains/taskManagement/application/useCases/CompleteTaskUseCase.ts
import { ITaskRepo } from "../interfaces/ITaskRepo";
import { Task } from "../../../taskManagement/domain/entities/Task";

export interface CompleteTaskInput {
  id: string;
  completedByCaregiverId: string;
  notes?: string[] | null;
}

export class CompleteTaskUseCase {
  constructor(private repo: ITaskRepo) {}

  public async execute(input: CompleteTaskInput): Promise<Task> {
    const task = await this.repo.getById(input.id);
    if (!task) throw new Error("Task not found");

    // If not started yet, allow direct completion (real-world rule can differ)
    if (task.status !== "IN_PROGRESS" && task.status !== "ASSIGNED") {
      throw new Error("Only ASSIGNED or IN_PROGRESS tasks can be completed");
    }

    task.complete(input.completedByCaregiverId, input.notes ?? null);
    await this.repo.save(task);
    return task;
  }
}