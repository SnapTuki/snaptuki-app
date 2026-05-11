import { ITaskRepo } from "../interfaces/ITaskRepo";
import { Task } from "../../domain/entities/Task";

interface CancelTaskRequest {
  id: string;
  reason?: string | null;
}

export class CancelTaskUseCase {
  constructor(private repo: ITaskRepo) {}

  public async execute(request: CancelTaskRequest): Promise<Task> {
    // 1. Retrieve the task from the repository
    const task = await this.repo.getById(request.id);

    if (!task) {
      throw new Error(`Task with ID ${request.id} not found.`);
    }

    // 2. Apply the domain logic to cancel the task
    // This is where business rules (like preventing cancellation of 
    // already completed tasks) should live.
    task.cancel(request.reason ?? "No reason provided");

    // 3. Persist the updated state
    await this.repo.save(task);

    return task;
  }
}