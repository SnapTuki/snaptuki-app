import { CareTask } from '../../domain/entities/CareTask';
import { CareTaskDetailsDTO } from '../../application/dtos/CareTaskDetailsDto';
import { CareTaskListItemDto } from '../dtos/CareTaskListItemDto';
export interface ICareTaskRepository {
  save(careTask: CareTask): Promise<void>;

  findById(careTaskId: string): Promise<CareTask | null>;

  findTodayCareTasks(params: { date: Date; }): Promise<CareTaskListItemDto[]>;

  findTasksEligibleForOverdue(currentTime: Date,): Promise<CareTask[]>;

  findTasksEligibleForMissed(currentTime: Date,): Promise<CareTask[]>;
}