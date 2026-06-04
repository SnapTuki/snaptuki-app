// src/domains/residentManagement/application/useCases/DischargeResidentUseCase.ts

import { IResidentRepo } from "../interfaces/IResidentRepo";
import { ResidentMap } from "../../infrastructure/prisma/mappers/ResidentMap";
import { ResidentDTO } from "../dtos/ResidentDTO";

export class DischargeResidentUseCase {
    constructor(private readonly repo: IResidentRepo) {}

    public async execute(id: string): Promise<{ resident: ResidentDTO }> {
        // 1. Fetch the Aggregate Root
        const resident = await this.repo.getById(id);
        if (!resident) {
            throw new Error(`Resident with ID ${id} was not found.`);
        }

        // 2. Fire the domain lifecycle behavior
        resident.discharge();

        // 3. Persist the updated aggregate state (saves status and deactivates care plan tasks)
        await this.repo.save(resident);

        // 4. Safely return the clean DTO data structure to the presentation layer
        return { resident: ResidentMap.toDTO(resident) };
    }
}