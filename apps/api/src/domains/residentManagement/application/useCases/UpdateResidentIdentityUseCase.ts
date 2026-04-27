import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Resident } from "../../domain/entities/Resident";

export class UpdateResidentIdentityUseCase {
    constructor(private repo: IResidentRepo) {};

    public async execute(request: any): Promise<Resident> {
        const resident = await this.repo.getById(request.residentId);

        if (!resident) throw new Error('Resident not found');

        // Assuming your Resident entity has a method to update identity 
        // to handle any business rules (e.g., preventing DOB changes after audit)
        resident.updateIdentity({
            firstName: request.firstName,
            lastName: request.lastName,
            birthDate: request.birthDate,
            gender: request.gender
        });

        await this.repo.save(resident);
        return resident;
    }
}