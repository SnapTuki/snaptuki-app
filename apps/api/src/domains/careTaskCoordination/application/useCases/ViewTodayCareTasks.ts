import { ICareTaskRepository } from "../interfaces/ICareTaskRepository";
import { CareTaskListItemDto } from "../dtos/CareTaskListItemDto";

export class ViewTodayCareTasks {
    constructor(private readonly careTaskRepo: ICareTaskRepository) {}
    
    async execute(): Promise<CareTaskListItemDto[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return await this.careTaskRepo.findTodayCareTasks({ date: today });
    }
}