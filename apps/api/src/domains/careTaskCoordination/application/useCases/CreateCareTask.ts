import { ICareTaskRepository } from "../interfaces/ICareTaskRepository";
import { NewCareTaskInput } from "../dtos/CreateCareTaskDto";
import { CareTask } from "../../domain/entities/CareTask";
import { CareTaskTitle } from "../../domain/valueObjects/CareTaskTitle";
import { CareTaskDescription } from "../../domain/valueObjects/CareTaskDescription";
import {CareTaskPriority} from "../../domain/valueObjects/CareTaskPriority";
import { CareTaskStatus } from "../../domain/valueObjects/CareTaskStatus";
import { DueTime } from "../../domain/valueObjects/DueTime";

export class CreateCareTask {
    constructor(private readonly careTaskRepository: ICareTaskRepository) { }

    async execute(careTaskInput: NewCareTaskInput): Promise<void> {

        //validate all fields and create value objects for each field
        const title = CareTaskTitle.create(careTaskInput.title);
        const description = CareTaskDescription.create(careTaskInput.description);

        const priority = CareTaskPriority.create(careTaskInput.priority);
        const stauts = CareTaskStatus.create(careTaskInput.status);
        const dueTime = DueTime.create(new Date(careTaskInput.dueTime));
        const assignedCaregiverId = careTaskInput.assignedToCaregiverId ? careTaskInput.assignedToCaregiverId : undefined;
        const assignedResidentId = careTaskInput.assignedToResidentId ? careTaskInput.assignedToResidentId : undefined;

        //create care task entity
        const careTask = CareTask.create(title, description, priority, stauts, dueTime, assignedCaregiverId!, assignedResidentId!);

        //save care task entity to repository
        await this.careTaskRepository.save(careTask);
    }

}