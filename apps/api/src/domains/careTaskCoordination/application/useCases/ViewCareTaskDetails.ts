import {ICareTaskRepository} from "../interfaces/ICareTaskRepository";
import {CareTaskDetailsDTO} from "../dtos/CareTaskDetailsDto";

export class ViewCareTaskDetails {
    constructor(private readonly careTaskRepository: ICareTaskRepository) { }

    async execute(careTaskId: string): Promise<CareTaskDetailsDTO | null> {
 
        const careTaskDetails = await this.careTaskRepository.findCareTaskDetailsById(careTaskId);
        return careTaskDetails;
    }
}