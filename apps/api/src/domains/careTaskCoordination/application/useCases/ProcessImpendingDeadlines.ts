import { ITaskRepo } from "../interfaces/ITaskRepo";

export class ProcessImpendingDeadlines {
    constructor(private taskRepo: ITaskRepo){}

    async execute(): Promise<void>{
        console.log('Starting Deadline Approaching job')
        const now = new Date();
        const fifteenMinsFromNow = new Date(now.getTime() + 15 * 60000);

        const impendingTasks = await this.taskRepo.findImpendingTasks(fifteenMinsFromNow,
            now
        );

        for (const task of impendingTasks){
            console.log(`[ALERT] Pre-deadline nudge for Task ${task.id}`);
        }
    }
}