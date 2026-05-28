// src/domains/residentManagement/application/useCases/UpdateResidentPlacementUseCase.ts

import { IResidentRepo } from "../interfaces/IResidentRepo";
import { MobilityLevel } from "../../domain/entities/Resident";
import { ResidentMap } from "../../infrastructure/mappers/ResidentMap";
import { ResidentDTO } from "../dtos/ResidentDTO";

export interface UpdatePlacementRequest {
    id: string;
    room?: string;
    mobilityLevel?: MobilityLevel;
    // Keep this commented out or remove completely since it's not part of ResidentProps yet
    // admissionDate?: string; 
}

export class UpdateResidentPlacementUseCase {
    constructor(private readonly repo: IResidentRepo) {}

    public async execute(request: UpdatePlacementRequest): Promise<{ resident: ResidentDTO }> {
        // 1. Fetch the Aggregate Root
        const resident = await this.repo.getById(request.id);
        if (!resident) {
            throw new Error("Resident not found");
        }

        // 2. Delegate the room/mobility change to the domain to assert invariants
        resident.updatePlacement({
            room: request.room,
            mobilityLevel: request.mobilityLevel,
        });

        // 3. Persist the updated aggregate state
        await this.repo.save(resident);

        // 4. Safely map and return the flat presentation payload
        return { resident: ResidentMap.toDTO(resident) };
    }
}