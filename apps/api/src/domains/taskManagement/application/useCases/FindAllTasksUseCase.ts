import { ITaskRepo } from "../interfaces/ITaskRepo";
import { Task } from "../../domain/entities/Task";

interface FindTasksRequest {
  search?: string | null;
  status?: string | null;
  caregiverId?: string | null;
  residentId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  skip?: number;
  take?: number;
}

export class FindAllTasksUseCase {
  constructor(private repo: ITaskRepo) {}

  public async execute(request: FindTasksRequest): Promise<Task[]> {
    // Business Logic: If a residentId is provided but no date range, 
    // default to showing tasks from the last 30 days to optimize performance.
    const start = request.startDate ?? null;
    const end = request.endDate ?? null;

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

    return tasks;
  }
}