import { CronJob } from 'cron';
import { PrismaTaskRepo } from '../repos/PrismaTaskRepo';
import { ProcessImpendingDeadlines } from '../../application/useCases/ProcessImpendingDeadlines';
import { EscalateMissedTasksUseCase } from '../../application/useCases/EscalateMissedTasks';
import prisma from '../../../../prisma/client';
export const initializeTaskScheduler = () => {

    console.log('🤖 Task Scheduler initialized. Monitoring healthcare building tasks...');
    const taskRepository = new PrismaTaskRepo(prisma)
    const processImpending = new ProcessImpendingDeadlines(taskRepository);
    const escalateMissed = new EscalateMissedTasksUseCase(taskRepository);

    // The Cron Trigger: Runs every 60 seconds

    const job = new CronJob(
        '*/5 * * * *',
        async () => {
            try {
                console.log('Running background job for tasks')
                await processImpending.execute();
                await escalateMissed.execute();

            } catch (error) {
                console.error('Critical Error in Task Scheduler Pipeline:', error);
            }
        },
        null,
        true,
    )


}