import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Resident } from "../../domain/entities/Resident";
import { MobilityLevel } from "../../domain/entities/Resident";

interface UpdatePlacementRequest {
    id: string;
    room?: string;
    mobilityLevel?: MobilityLevel;
    admissionDate?: string;
}

export class UpdateResidentPlacementUseCase {
    constructor(private repo: IResidentRepo) {};

    public async execute(request: UpdatePlacementRequest): Promise<Resident> {
        const resident = await this.repo.getById(request.id);

        if (!resident) throw new Error('Resident not found');

        // Logic here might include checking if the room is available 
        // or triggering a room-change log in a real system.
        resident.updatePlacement({
            room: request.room,
            mobilityLevel: request.mobilityLevel,
            //admissionDate: request.admissionDate
        });

        await this.repo.save(resident);
        return resident;
    }
}