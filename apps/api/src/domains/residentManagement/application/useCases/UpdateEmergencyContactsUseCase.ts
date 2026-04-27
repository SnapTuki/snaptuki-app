import { IResidentRepo } from "../interfaces/IResidentRepo";
import { Resident } from "../../domain/entities/Resident";
import { EmergencyContactMap } from "../../infrastructure/mappers/EmergencyContactMap";
import { randomUUID } from "node:crypto";
export class UpdateEmergencyContactsUseCase {
    constructor(private repo: IResidentRepo) {};

    public async execute(residentId: string, contacts: any): Promise<Resident> {
        const resident = await this.repo.getById(residentId);
        if (!resident) throw new Error('Resident not found');

        const processedContacts = contacts.map((c:any) => ({
            ...c,
            // If the ID is missing or a frontend temp ID, generate a real UUID
            id: (!c.id || c.id.startsWith('temp-')) ? randomUUID() : c.id
        }));

        const emgContacts = EmergencyContactMap.toDomain(processedContacts);
        resident.setContacts(emgContacts);

        await this.repo.save(resident);
        return resident;
    }
}