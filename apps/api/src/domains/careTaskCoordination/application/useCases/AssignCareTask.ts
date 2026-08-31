import { ICareTaskRepository } from "../interfaces/ICareTaskRepository";


export class AssignCareTask {
  constructor(
    private readonly careTaskRepository: ICareTaskRepository,
  ) {}

  async execute(
    command: {caregiverId: string, careTaskId: string},
  ): Promise<{careTaskId: string, caregiverId: string}> {
    const careTask = await this.careTaskRepository.findById(
      command.careTaskId,
    );

    if (!careTask) {
      throw new Error("CareTask not found");
    }

    careTask.assignToCaregiver(command.caregiverId);
    await this.careTaskRepository.save(careTask);

    return {careTaskId: careTask.getId(), caregiverId: command.caregiverId};
  }
}