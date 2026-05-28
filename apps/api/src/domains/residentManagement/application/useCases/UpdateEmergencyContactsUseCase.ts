// src/domains/residentManagement/application/useCases/UpdateEmergencyContactsUseCase.ts

import { IResidentRepo } from "../interfaces/IResidentRepo";
import { EmergencyContact } from "../../domain/entities/EmergencyContact";
import { ResidentMap } from "../../infrastructure/mappers/ResidentMap";
import { ResidentDTO } from "../dtos/ResidentDTO";
import { randomUUID } from "node:crypto";

export interface UpdateEmergencyContactInput {
  id?: string | null;
  name: string;
  relation: string;
  phone: string;
  email?: string | null;
  isPrimary?: boolean;
}

export class UpdateEmergencyContactsUseCase {
  constructor(private readonly repo: IResidentRepo) {}

  public async execute(
    residentId: string, 
    contacts: UpdateEmergencyContactInput[]
  ): Promise<{ resident: ResidentDTO }> {
    
    // 1. Fetch the Aggregate Root
    const resident = await this.repo.getById(residentId);
    if (!resident) {
      throw new Error("Resident not found");
    }

    // 2. Map input raw JSON objects straight into pure Domain Child Entities
    const emgContacts = contacts.map(c => {
      // Clean up or generate IDs directly inside the application flow
      const safeId = (!c.id || c.id.startsWith("temp-")) ? randomUUID() : c.id;

      return EmergencyContact.createNew({
        id: safeId,
        name: c.name,
        relation: c.relation,
        phone: c.phone, // Value object parsing happens inside this factory safely
        email: c.email,
        isPrimary: c.isPrimary,
      });
    });

    // 3. Delegate collection synchronization and invariants to the Aggregate Root
    resident.setContacts(emgContacts);

    // 4. Save the aggregate via the unified upsert repository
    await this.repo.save(resident);

    // 5. Safely return the presentation layer data payload
    return { resident: ResidentMap.toDTO(resident) };
  }
}