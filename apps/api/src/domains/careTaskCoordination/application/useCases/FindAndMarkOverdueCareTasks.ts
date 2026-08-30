import { ICareTaskRepository } from '../interfaces/ICareTaskRepository';

export class FindAndMarkOverdueCareTasks {
  constructor(
    private readonly careTaskRepository: ICareTaskRepository,
  ) {}

  async execute(currentTime: Date = new Date()): Promise<void> {
    const careTasks =
      await this.careTaskRepository.findTasksEligibleForOverdue(
        currentTime,
      );

    for (const careTask of careTasks) {
      careTask.markAsOverdue(currentTime);
      await this.careTaskRepository.save(careTask);
    }
  }
}