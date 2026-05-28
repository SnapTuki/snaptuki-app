// src/domains/residentManagement/domain/entities/EmergencyContact.ts
import { Email } from "../valueObjects/Email";
import { PhoneNumber } from "../valueObjects/PhoneNumber";

// 1. Explicit Read-Only State for the Mapper and Snapshot
export interface EmergencyContactState {
  id: string;
  name: string;
  relation: string;
  phone: string; // Unwrapped Value Object
  email: string | null; // Unwrapped Value Object
}

// 2. Internal Encapsulated Props
interface EmergencyContactProps {
  id: string;
  name: string;
  relation: string;
  phone: PhoneNumber;
  email: Email | null;
}

export class EmergencyContact {
  private props: EmergencyContactProps;

  private constructor(props: EmergencyContactProps) {
    this.props = { ...props };
  }

  /**
   * --- DOMAIN FACTORY: For adding a BRAND NEW emergency contact ---
   */
  public static createNew(props: {
    id: string; // The Orchestrator/Use Case should generate this (e.g., crypto.randomUUID())
    name: string;
    relation: string;
    phone: string; // Accept raw strings in the factory...
    email?: string | null;
    isPrimary?: boolean;
  }): EmergencyContact {
    if (!props.id || !props.name || !props.relation || !props.phone) {
      throw new Error("EmergencyContact requires id, name, relation, and phone");
    }

    // ...and convert them to Value Objects here!
    const phoneNumber = PhoneNumber.create(props.phone);
    if (!phoneNumber) throw new Error("Invalid phone number provided for emergency contact.");

    return new EmergencyContact({
      id: props.id,
      name: props.name.trim(),
      relation: props.relation.trim(),
      phone: phoneNumber,
      email: props.email ? Email.create(props.email) : null,
    });
  }

  /**
   * --- REHYDRATION FACTORY: For loading from Prisma ---
   */
  public static restore(snapshot: EmergencyContactState): EmergencyContact {
    return new EmergencyContact({
      id: snapshot.id,
      name: snapshot.name,
      relation: snapshot.relation,
      phone: PhoneNumber.create(snapshot.phone)!, 
      email: snapshot.email ? Email.create(snapshot.email) : null,
    });
  }

  /**
   * --- THE SNAPSHOT PATTERN ---
   */
  public snapshot(): EmergencyContactState {
    return {
      id: this.props.id,
      name: this.props.name,
      relation: this.props.relation,
      phone: this.props.phone.value, // Extract the raw string
      email: this.props.email ? this.props.email.toString() : null, // Extract the raw string
    };
  }

  /**
   * --- SELECTIVE GETTERS (For Aggregate Root Rules Only) ---
   */
  get id(): string {
    return this.props.id;
  }

  /**
   * --- DOMAIN BEHAVIORS ---
   */

  public updateContactDetails(phone: string, email: string | null): void {
    const newPhone = PhoneNumber.create(phone);
    if (!newPhone) throw new Error("Invalid phone number format.");
    
    this.props.phone = newPhone;
    this.props.email = email ? Email.create(email) : null;
  }
}