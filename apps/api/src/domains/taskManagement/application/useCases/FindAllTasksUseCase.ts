// src/domains/taskManagement/application/useCases/FindAllTasksUseCase.ts

import { ITaskRepo } from "../interfaces/ITaskRepo";
import { TaskMap } from "../../infrastructure/mappers/TaskMap";
import { TaskDTO } from "../dtos/TaskDTO";

export interface FindTasksRequest {
  search?: string | null;
  status?: string | null; // Could optionally be typed to TaskStatus enum
  caregiverId?: string | null;
  residentId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  skip?: number;
  take?: number;
}

export class FindAllTasksUseCase {
  constructor(private readonly repo: ITaskRepo) {}

  public async execute(request: FindTasksRequest): Promise<{ tasks: TaskDTO[] }> {
    let start = request.startDate ?? null;
    const end = request.endDate ?? null;

    // 1. Business Logic Execution: Enforce performance boundaries for resident queries
    if (request.residentId && !start && !end) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      start = thirtyDaysAgo;
    }

    // 2. Fetch Aggregates via Repository
    const tasks = await this.repo.list({
      search: request.search ?? null,
      status: request.status ?? null,
      caregiverId: request.caregiverId ?? null,
      residentId: request.residentId ?? null,
      startDate: start,
      endDate: end,
      skip: request.skip,
      take: request.take,
    });

    // 3. Transform and safely return the presentation layer payload
    return {
      tasks: tasks.map(task => TaskMap.toDTO(task))
    };
  }
}