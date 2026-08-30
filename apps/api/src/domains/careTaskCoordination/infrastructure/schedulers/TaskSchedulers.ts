import { CronJob } from 'cron';
import { PrismaCareTaskRepository } from '../repos/PrismaTaskRepo';
import { FindAndMarkOverdueCareTasks } from '../../application/useCases/FindAndMarkOverdueCareTasks';
import prisma from '../../../../prisma/client';
export const initializeTaskScheduler = () => {

    console.log('🤖 Task Scheduler initialized. Monitoring healthcare building tasks...');
    const taskRepository = new PrismaCareTaskRepository(prisma)
    const findAndMarkOverdueCareTasks = new FindAndMarkOverdueCareTasks(taskRepository);

    // The Cron Trigger: Runs every 60 seconds

    const TIME_ZONE = "Europe/Helsinki";

    const overdueTasksJob = new CronJob(
        "* * * * *",
        async () => {
            try {
                console.log("Checking for overdue CareTasks");

                await findAndMarkOverdueCareTasks.execute(new Date());

            } catch (error) {
                console.error(
                    "Critical error in overdue CareTask job:",
                    error,
                );
            }
        },
        null,
        true,
        TIME_ZONE,
    );

}