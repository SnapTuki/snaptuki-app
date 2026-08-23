import {CareTask} from '../../domain/entities/CareTask';
import {CareTaskStatus} from '../../domain/valueObjects/CareTaskStatus';

export interface ICareTaskRepository {
  save(careTask: CareTask): Promise<void>;

  findById(careTaskId: string): Promise<CareTask | null>;

  findTodayCareTasks(params: {
    date: Date;
  }): Promise<CareTask[]>;

}