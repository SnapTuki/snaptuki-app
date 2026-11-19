import { ICareTaskRepository } from "../interfaces/ICareTaskRepository";
import { DueTime } from "../../domain/valueObjects/DueTime";

interface RescheduleCareTaskCommand {
    careTaskId: string;
    newDueTime: Date;
}


export class RescheduleCareTask {
  constructor(
    private readonly careTaskRepository: ICareTaskRepository,
  ) {}

  async execute(
    command: RescheduleCareTaskCommand,
  ): Promise<{careTaskId: string, dueTime: Date}> {
    const careTask = await this.careTaskRepository.findById(
      command.careTaskId,
    );

    if (!careTask) {
      throw new Error("CareTask not found");
    }

    careTask.rescheduel({
        newScheduel: DueTime.create(command.newDueTime)
    });

    await this.careTaskRepository.save(careTask);

    return {careTaskId: command.careTaskId, dueTime: command.newDueTime};
  }
}