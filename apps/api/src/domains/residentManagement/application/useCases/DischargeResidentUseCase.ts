import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Resident } from "../../domain/entities/Resident";
export class DischargeResidentUseCase {
    constructor (private repo: IResidentRepo){};

    public async execute(id: string): Promise<Resident>{
        const resident = await this.repo.getById(id);

        if(!resident) throw new Error('Resident was not found');

        resident.discharge();
        await this.repo.save(resident);
        return resident;
    }
}