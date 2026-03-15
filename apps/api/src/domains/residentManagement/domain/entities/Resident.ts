// src/domains/residentManagement/domain/entities/Resident.ts
import { Email } from "../valueObjects/Email";
import { PhoneNumber } from "../valueObjects/PhoneNumber";
import { MedicalRecordNumber } from "../valueObjects/MedicalRecordNumber";
import { Allergy } from "./Allergy";
import { Medication } from "./Medication";
import { EmergencyContact } from "./EmergencyContact";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";
export type MobilityLevel = "INDEPENDENT" | "ASSISTED" | "MEMORY";

export interface ResidentProps {
  id: string;
  mrn: MedicalRecordNumber;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: Gender;
  email: Email | null;
  phone: PhoneNumber | null;

  mobilityLevel: MobilityLevel;
  room: string | null;

  primaryCaregiverId?: string | null; // reference to CaregiverManagement
  guardianUserId?: string | null;     // reference to IdentityAccess.User

  allergies: Allergy[];
  medications: Medication[];
  emergencyContacts: EmergencyContact[];

  createdAt?: Date;
  updatedAt?: Date;
}

export class Resident {
  private props: ResidentProps;

  private constructor(props: ResidentProps) {
    this.props = { ...props };
  }

  public static create(props: ResidentProps) {
    if (!props.id || !props.mrn || !props.firstName || !props.lastName||!props.birthDate || !props.gender) {
      throw new Error("Missing required Resident properties");
    }
    return new Resident({
      ...props,
      allergies: props.allergies ?? [],
      medications: props.medications ?? [],
      emergencyContacts: props.emergencyContacts ?? [],
    });
  }

  // getters
  get id() { return this.props.id; }
  get mrn() { return this.props.mrn; }
  get firstName() { return this.props.firstName; }
  get lastName() { return this.props.lastName; }
  get birthDate() { return this.props.birthDate; }
  get gender() { return this.props.gender; }
  get email() { return this.props.email; }
  get phone() { return this.props.phone; }

  get mobilityLevel() { return this.props.mobilityLevel; }
  get room() { return this.props.room; }

  get primaryCaregiverId() { return this.props.primaryCaregiverId ?? null; }
  get guardianUserId() { return this.props.guardianUserId ?? null; }

  get allergies() { return [...this.props.allergies]; }
  get medications() { return [...this.props.medications]; }
  get emergencyContacts() { return [...this.props.emergencyContacts]; }

  get createdAt() { return this.props.createdAt ?? new Date(); }
  get updatedAt() { return this.props.updatedAt ?? new Date(); }

  // behaviors
  updateContact(email: Email | null, phone: PhoneNumber | null) {
    this.props.email = email;
    this.props.phone = phone;
  }


  setPrimaryCaregiver(caregiverId: string | null) {
    this.props.primaryCaregiverId = caregiverId;
  }

  changeCareLevel(level: MobilityLevel, room: string | null) {
    this.props.mobilityLevel = level;
    this.props.room = room;
  }

  

  addAllergy(a: Allergy) {
    if (!this.props.allergies.find(x => x.id === a.id)) {
      this.props.allergies.push(a);
    }
  }

  addMedication(m: Medication) {
    if (!this.props.medications.find(x => x.id === m.id)) {
      this.props.medications.push(m);
    }
  }

  addEmergencyContact(c: EmergencyContact) {
    if (!this.props.emergencyContacts.find(x => x.id === c.id)) {
      this.props.emergencyContacts.push(c);
    }
  }

  linkGuardianUser(userId: string) {
    this.props.guardianUserId = userId;
  }
}