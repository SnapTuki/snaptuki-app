// src/domains/taskManagement/application/useCases/CompleteTaskUseCase.ts

import { ITaskRepo } from "../interfaces/ITaskRepo";
import { TaskMap } from "../../infrastructure/mappers/TaskMap";
import { TaskDTO } from "../dtos/TaskDTO";

export interface CompleteTaskInput {
  id: string;
  completedByCaregiverId: string;
  notes?: string[] | null;
}

export class CompleteTaskUseCase {
  constructor(private readonly repo: ITaskRepo) {}

  public async execute(input: CompleteTaskInput): Promise<{ task: TaskDTO }> {
    // 1. Fetch the Aggregate Root
    const task = await this.repo.getById(input.id);
    if (!task) {
      throw new Error(`Task with ID ${input.id} not found.`);
    }

    // 2. Delegate to the Domain
    // ALL business rules (including status checks and mandatory checklist validation) 
    // are executed safely inside this method.
    task.complete(input.completedByCaregiverId, input.notes ?? null, new Date());

    // 3. Persist the mutated state using the unified repository pattern
    await this.repo.save(task);

    // 4. Safely return the presentation layer payload
    return { task: TaskMap.toDTO(task) };
  }
}