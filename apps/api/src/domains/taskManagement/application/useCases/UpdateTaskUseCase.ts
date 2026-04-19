import { ITaskRepo } from "../interfaces/ITaskRepo";
import { Task } from "../../domain/entities/Task";

export class UpdateTaskUseCase {
  constructor(private taskRepo: ITaskRepo) {}

  async execute(input: any): Promise<Task> {
    const task = await this.taskRepo.getById(input.id);
    if (!task) throw new Error("Task not found");

    // Apply updates to the Domain Entity
    // Assuming your Task Entity has an 'update' or setter methods
    task.update({
      title: input.title,
      description: input.description,
      priority: input.priority,
      assignedCaregiverId: input.assignedCaregiverId,
      dueAt: input.dueAt,
      checklist: input.checklist
    });

    await this.taskRepo.save(task); // repo.save handles the Prisma update
    return task;
  }
}