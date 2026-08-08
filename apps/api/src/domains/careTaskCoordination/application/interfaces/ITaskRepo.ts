// src/domains/taskManagement/application/interfaces/ITaskRepo.ts
import { Task } from "../../domain/entities/Task";

export interface ITaskRepo {
  // --- Standard Aggregate Lifecycle ---
  getById(id: string): Promise<Task | null>;
  
  list(params?: {
    take?: number; skip?: number;
    search?: string | null;
    status?: string | null;
    caregiverId?: string | null;
    residentId?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    dueAt?: Date | null;
  }): any;
  
  // Replaced create/save with the unified Upsert pattern
  save(task: Task): Promise<void>;
  
  delete(id: string): Promise<void>;

  // --- Smart Task Center Queries ---
  // These are perfect! They return fully rehydrated Task aggregates.
  
  /**
   * Finds tasks that are due soon and haven't been alerted yet.
   */
  findImpendingTasks(targetTime: Date, currentTime: Date): Promise<Task[]>;
  
  /**
   * Finds pending or assigned tasks whose due date has passed.
   */
  findMissedTasks(currentTime: Date): Promise<Task[]>;
}