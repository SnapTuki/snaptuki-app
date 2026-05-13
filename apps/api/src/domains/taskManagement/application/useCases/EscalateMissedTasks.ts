import { ITaskRepo } from "../interfaces/ITaskRepo";

export class EscalateMissedTasks {
    constructor(private repo: ITaskRepo) { }

    async execute(): Promise<void> {
        const now = new Date()

        const missedTasks = await this.repo.findMissedTasks(now);

        for (const task of missedTasks) {
            console.log(`[ESCALATION] Task ${task.id} is overdue. Auto-mutating status to Cancelled.`);

            // Update database state
            await this.repo.markTaskAsMissed(task.id);
        }
    }
}