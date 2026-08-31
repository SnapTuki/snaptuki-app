import { ICareTaskRepository } from "../interfaces/ICareTaskRepository";

export class CompleteCareTask {
    constructor(
        private readonly careTaskRepository: ICareTaskRepository,
    ) { }

    async execute(
        command: { careTaskId: string, completionNote?: string },
    ): Promise<{ careTaskId: string, completionNote?:string }> {
        const careTask = await this.careTaskRepository.findById(command.careTaskId);

        if (!careTask) {
            throw new Error("CareTask not found");
        }

        careTask.completeCareTask(command.completionNote);

        await this.careTaskRepository.save(careTask);

        return {careTaskId: command.careTaskId, completionNote: command.completionNote}
    }
}