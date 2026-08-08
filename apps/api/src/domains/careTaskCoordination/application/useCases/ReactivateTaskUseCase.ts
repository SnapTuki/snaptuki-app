import { TaskMap } from "../../infrastructure/mappers/TaskMap";
import { ITaskRepo } from "../interfaces/ITaskRepo";

export class ReactivateTaskUseCase {
    constructor(private readonly repo: ITaskRepo){}

    public async execute(taskId: string){
        const task = await this.repo.getById(taskId);
        if(!task) throw Error("No Task Found!");


        task.reactivateTask();

        this.repo.save(task);

        return { task: TaskMap.toDTO(task) }
    }
}