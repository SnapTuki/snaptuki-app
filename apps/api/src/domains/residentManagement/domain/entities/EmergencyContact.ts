// src/domains/residentManagement/domain/entities/EmergencyContact.ts
import { Email } from "../valueObjects/Email";
import { PhoneNumber } from "../valueObjects/PhoneNumber";

export class EmergencyContact {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly relation: string,
    public readonly phone: PhoneNumber,
    public readonly email: Email | null,
    public readonly isPrimary: boolean
  ) {}

  public static create(props: {
    id: string;
    name: string;
    relation: string;
    phone: PhoneNumber;
    email?: string | null;
    isPrimary?: boolean;
  }) {
    if (!props.id || !props.name || !props.relation || !props.phone) {
      throw new Error("EmergencyContact requires id, name, relation, phone");
    }
    return new EmergencyContact(
      props.id,
      props.name.trim(),
      props.relation.trim(),
      PhoneNumber.create(props.phone.value)!,
      Email.create(props.email),
      props.isPrimary ?? false
    );
  }
}