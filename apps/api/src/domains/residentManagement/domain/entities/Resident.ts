// src/domains/residentManagement/domain/entities/Resident.ts
import { Email } from "../valueObjects/Email";
import { PhoneNumber } from "../valueObjects/PhoneNumber";
import { MedicalRecordNumber } from "../valueObjects/MedicalRecordNumber";
import { Allergy } from "./Allergy";
import { Medication } from "./Medication";
import { EmergencyContact } from "./EmergencyContact";
import { TaskAssignment } from "./TaskAssignment"; 
import { Task } from "./Task";
import { SSN } from "../valueObjects/SSN";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNSPECIFIED = "UNSPECIFIED",
  OTHER = "OTHER"
}

export enum MobilityLevel{
  Independent = "INDEPENDENT",
  Assisted = "ASSISTED",
  Memory = "MEMORY"
}

export enum ResidentStatus {
  Active = "ACTIVE",
  Discharged = "DISCHARGED"
}

// 1. Explicit Read-Only State for Mappers and DTOs
export interface ResidentState {
  residentId: string;
  agencyId: number;
  mrn: string; // Unwrapped Value Object
  firstName: string;
  lastName: string;
  ssn: string; //Unwrapped Value
  birthDate: Date;
  gender: Gender;
  mobilityLevel: MobilityLevel;
  room: string | null;
  status: ResidentStatus;

  createdAt: Date;
  updatedAt: Date;
}

// 2. Internal Encapsulated Props
export interface ResidentProps {
  residentId: string;
  agencyId: number;
  mrn: MedicalRecordNumber;
  firstName: string;
  lastName: string;
  ssn: SSN;
  birthDate: Date;
  gender: Gender;
  mobilityLevel: MobilityLevel;
  room: string | null;
  status: ResidentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Resident {
  private props: ResidentProps;

  private constructor(props: ResidentProps) {
    this.props = { ...props };
  }

  /**
   * --- DOMAIN FACTORY: For admitting a BRAND NEW resident ---
   */
  public static createNew(
    props: Omit<ResidentProps, "status" | "createdAt" | "updatedAt" | "allergies" | "medications" | "emergencyContacts" | "taskAssignments" | "tasks"> & 
    { 
      allergies?: Allergy[], 
      medications?: Medication[], 
      emergencyContacts?: EmergencyContact[] 
    }
  ): Resident {
    
    if (!props.residentId || !props.agencyId || !props.mrn || !props.firstName || !props.lastName) {
      throw new Error("Resident creation failed: Missing identity or agency context.");
    }

    const now = new Date();

    return new Resident({
      ...props,
      status: ResidentStatus.Active, // Always active upon admission
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * --- REHYDRATION FACTORY: For loading from Prisma ---
   */
  public static restore(snapshot: ResidentState): Resident {
    return new Resident({
      residentId: snapshot.residentId,
      agencyId: snapshot.agencyId,
      mrn: MedicalRecordNumber.create(snapshot.mrn), // Assuming your VO has a create method
      firstName: snapshot.firstName,
      lastName: snapshot.lastName,
      ssn: SSN.create(snapshot.ssn),
      birthDate: snapshot.birthDate,
      gender: snapshot.gender,
      mobilityLevel: snapshot.mobilityLevel,
      room: snapshot.room,
      status: snapshot.status,
      
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    });
  }

  /**
   * --- THE SNAPSHOT PATTERN ---
   * Completely replaces all `get` accessors.
   */
  public snapshot(): ResidentState {
    return {
      residentId: this.props.residentId,
      agencyId: this.props.agencyId,
      mrn: this.props.mrn.value, // Extract the raw string from the VO
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      ssn: this.props.ssn.getValue(),
      birthDate: this.props.birthDate,
      gender: this.props.gender,
      mobilityLevel: this.props.mobilityLevel,
      room: this.props.room,
      status: this.props.status,
    
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  // --- Domain Behaviors ---

  public discharge(): void {
    this.props.status = ResidentStatus.Discharged;
    this.thisTrackUpdate();
  }

  public updateCareLevel(level: MobilityLevel, newRoom?: string): void {
    this.props.mobilityLevel = level;
    if (newRoom) this.props.room = newRoom;
    this.thisTrackUpdate();
  }


  public updateIdentity(data: {
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    gender?: Gender;
  }): void {
    if (data.firstName) this.props.firstName = data.firstName;
    if (data.lastName) this.props.lastName = data.lastName;
    if (data.birthDate) {
      if (data.birthDate > new Date()) throw new Error("Birth date cannot be in the future");
      this.props.birthDate = data.birthDate;
    }
    if (data.gender) this.props.gender = data.gender;
    
    this.thisTrackUpdate();
  }

  public updatePlacement(data: {
    room?: string;
    mobilityLevel?: MobilityLevel;
  }): void {
    if (data.room !== undefined) this.props.room = data.room;
    if (data.mobilityLevel) this.props.mobilityLevel = data.mobilityLevel;
    this.thisTrackUpdate();
  }

  public setContacts(contacts: EmergencyContact[]): void {
    if (this.props.mobilityLevel === MobilityLevel.Memory && contacts.length === 0) {
      throw new Error("Memory Care residents must have at least one emergency contact.");
    }

    this.thisTrackUpdate();
  }

  /**
   * Automatically ticks the updatedAt timestamp on any state mutation.
   */
  private thisTrackUpdate(): void {
    this.props.updatedAt = new Date();
  }
}