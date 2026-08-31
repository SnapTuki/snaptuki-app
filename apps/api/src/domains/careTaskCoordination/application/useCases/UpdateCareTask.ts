import { ICareTaskRepository } from "../interfaces/ICareTaskRepository";
import { CareTaskDetailsDTO } from "../dtos/CareTaskDetailsDto";
import { CareTaskTitle } from "../../domain/valueObjects/CareTaskTitle";
import { CareTaskDescription } from "../../domain/valueObjects/CareTaskDescription";

interface UpdateCareTaskCommand {
  careTaskId: string;
  title: string;
  description: string;
}

export class UpdateCareTask {
  constructor(
    private readonly careTaskRepository: ICareTaskRepository,
  ) {}

  async execute(command: UpdateCareTaskCommand): Promise<Partial<CareTaskDetailsDTO>> {

    const careTask = await this.careTaskRepository.findById(command.careTaskId);

    if (!careTask) {
      throw new Error(
        `CareTask with ID ${command.careTaskId} was not found`,
      );
    }

    careTask.updateCareTaskDetails(CareTaskTitle.create(command.title), CareTaskDescription.create(command.description))

    await this.careTaskRepository.save(careTask);

    return {
        id: command.careTaskId,
        title: command.title,
        description: command.description
    };
  }
}