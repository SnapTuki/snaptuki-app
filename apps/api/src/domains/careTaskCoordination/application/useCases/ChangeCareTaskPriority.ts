import { ICareTaskRepository } from "../interfaces/ICareTaskRepository";
import { CareTaskPriority } from "../../domain/valueObjects/CareTaskPriority";

interface ChangeCareTaskPriorityCommand {
    careTaskId: string;
    newPriority: string;
}
export class ChangeCareTaskPriority {
    constructor(
        private readonly careTaskRepository: ICareTaskRepository,
    ) { }

    async execute(
        command: ChangeCareTaskPriorityCommand,
    ): Promise<{ careTaskId: string, priority: string }> {
        const careTask = await this.careTaskRepository.findById(command.careTaskId);

        if (!careTask) {
            throw new Error("CareTask not found");
        }

        const newPriority = CareTaskPriority.create(command.newPriority);

        careTask.changePriority({
            newPriority: newPriority
        })



        await this.careTaskRepository.save(careTask);

        return {
            careTaskId: command.careTaskId,
            priority: command.newPriority
        };}
    
}