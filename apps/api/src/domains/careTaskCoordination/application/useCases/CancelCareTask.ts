import { ICareTaskRepository } from "../interfaces/ICareTaskRepository";


export class CancelCareTask {
  constructor(
    private readonly careTaskRepository: ICareTaskRepository,
  ) {}

  async execute(
    command: {careTaskId: string},
  ): Promise<{careTaskId: string}> {
    const careTask = await this.careTaskRepository.findById(
      command.careTaskId,
    );

    if (!careTask) {
      throw new Error("CareTask not found");
    }

    careTask.cancelCareTask();

    await this.careTaskRepository.save(careTask);

    return {careTaskId: command.careTaskId};
  }
}