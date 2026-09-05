import { ICareTaskRepository } from "../interfaces/ICareTaskRepository";
import { CareTaskListItemDto } from "../dtos/CareTaskListItemDto";

export class ViewTomorrowCareTasks {
    constructor(private readonly repo: ICareTaskRepository){};

    async execute(): Promise<CareTaskListItemDto[]>{
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate()+1);
        tomorrow.setHours(0, 0, 0, 0);

        return await this.repo.findTodayCareTasks({date: tomorrow});
    }
}