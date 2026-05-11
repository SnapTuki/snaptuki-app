// src/domains/taskManagement/application/interfaces/ITaskRepo.ts
import { Task } from "../../../taskManagement/domain/entities/Task";

export interface ITaskRepo {
  getById(id: string): Promise<Task | null>;
  list(params?: {
    take?: number; skip?: number;
    search?: string | null;
    status?: string | null;
    caregiverId?: string | null;
    residentId?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
  }): Promise<Task[]>;
  create(task: Task): Promise<void>;
  save(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
}