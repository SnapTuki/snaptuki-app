// src/domains/taskManagement/application/useCases/EscalateMissedTasksUseCase.ts

import { ITaskRepo } from "../interfaces/ITaskRepo";

export class EscalateMissedTasksUseCase {
    constructor(private readonly repo: ITaskRepo) { }

    async execute(): Promise<void> {
        const now = new Date();

        // 1. Fetch the Aggregates from the repository
        const missedTasks = await this.repo.findMissedTasks(now);

        if (missedTasks.length > 0) {
            console.log(`[ESCALATION] Found ${missedTasks.length} overdue tasks.`);
        }

        for (const task of missedTasks) {
            console.log(`[ESCALATION] Task ${task.id} is overdue. Auto-mutating status to MISSED.`);

            // 2. Delegate the state mutation to the Domain Aggregate
            task.markAsMissed();

            // 3. Persist the updated aggregate state via the unified Upsert pattern
            await this.repo.save(task);

            // Note for MVP: This is the exact spot where you would inject an IAlertService 
            // to send a WebSocket event or Email notification to the manager (Laila)!
            // e.g., await this.alertService.notifyManager(task);
        }
    }
}