import { EmergencyContact } from "../../domain/entities/EmergencyContact";
import { PhoneNumber } from "../../domain/valueObjects/PhoneNumber";
import { EmergencyContact as EmergencyContactPrisma } from "../../../../generated/prisma";
export class EmergencyContactMap{
    static toDomain(row: EmergencyContactPrisma[]){
        const contacts = row.map(contact => EmergencyContact.create({
            id: contact.id,
            name: contact.name,
            relation: contact.relation,
            email: null,
            isPrimary: true,
            phone: PhoneNumber.create(contact.phone),
        }))

        return contacts

    }
}