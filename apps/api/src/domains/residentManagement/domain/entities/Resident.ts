// src/domains/residentManagement/domain/entities/Resident.ts
import { Email } from "../valueObjects/Email";
import { PhoneNumber } from "../valueObjects/PhoneNumber";
import { MedicalRecordNumber } from "../valueObjects/MedicalRecordNumber";
import { Allergy } from "./Allergy";
import { Medication } from "./Medication";
import { EmergencyContact } from "./EmergencyContact";
// Import TaskAssignment to complete the Care Plan domain
import { TaskAssignment } from "./TaskAssignment"; 
import { Gender, MobilityLevel, ResidentStatus } from "../../../../generated/prisma";
import { Task } from "./Task";

export interface ResidentProps {
  residentId: string;
  agencyId: number; // CRITICAL: Added for multi-tenancy
  mrn: MedicalRecordNumber;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: Gender;
  email: Email | null;
  phone: PhoneNumber | null;

  mobilityLevel: MobilityLevel;
  room: string | null;
  status: ResidentStatus;

  primaryCaregiverId?: string | null;
  guardianUserId?: string | null;

  allergies: Allergy[];
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
  taskAssignments: TaskAssignment[]; // Added: The "Care Plan"
  tasks: Task[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Resident {
  private props: ResidentProps;

  private constructor(props: ResidentProps) {
    this.props = { ...props };
  }

  public static create(props: ResidentProps): Resident {
    // Basic validation
    if (!props.residentId || !props.agencyId || !props.mrn || !props.firstName || !props.lastName) {
      throw new Error("Resident creation failed: Missing identity or agency context.");
    }

    return new Resident({
      ...props,
      allergies: props.allergies ?? [],
      medications: props.medications ?? [],
      emergencyContacts: props.emergencyContacts ?? [],
      taskAssignments: props.taskAssignments ?? [],
      status: props.status ?? ResidentStatus.ACTIVE,
    });
  }

  // --- Getters ---
  get residentId() { return this.props.residentId; }
  get agencyId() { return this.props.agencyId; }
  get mrn() { return this.props.mrn; }
  get fullName() { return `${this.props.firstName} ${this.props.lastName}`; }
  get firstName(){return this.props.firstName;}
  get lastName(){return this.props.lastName;}
  get status() { return this.props.status; }
  get mobilityLevel() { return this.props.mobilityLevel; }
  get room() { return this.props.room; }
  get birthDate() {return this.props.birthDate;}
  get email(){return this.props.email;}
  get phone(){return this.props.phone;}
  get gender(){return this.props.gender;}
  get createdAt(){return this.props.createdAt;}
  get updatedAt(){return this.props.updatedAt;}

  // Return copies to prevent external mutation of private state
  get allergies() { return [...this.props.allergies]; }
  get medications() { return [...this.props.medications]; }
  get taskAssignments() { return [...this.props.taskAssignments]; }
  get emergencyContacts(){return [...this.props.emergencyContacts];}
  get tasks(){return [...this.props.tasks];}

  // --- Domain Behaviors (The "Rich" part of the model) ---

  /**
   * Discharging a resident is a major lifecycle event.
   * You might want to add logic here to deactivate all task assignments automatically.
   */
  public discharge(): void {
    this.props.status = ResidentStatus.DISCHARGED;
    this.props.updatedAt = new Date();
    // Logic: When discharged, stop all recurring care
    this.props.taskAssignments.forEach(assignment => assignment.deactivate());
  }

  public updateCareLevel(level: MobilityLevel, newRoom?: string): void {
    this.props.mobilityLevel = level;
    if (newRoom) this.props.room = newRoom;
    this.props.updatedAt = new Date();
  }

  public assignToCaregiver(caregiverId: string | null): void {
    this.props.primaryCaregiverId = caregiverId;
  }

  public addMedication(med: Medication): void {
    const exists = this.props.medications.some(m => m.id === med.id);
    if (!exists) {
      this.props.medications.push(med);
    }
  }

  public addAllergy(allergy: Allergy): void {
    // 1. Business Rule: Check for duplicates by ID
    const alreadyExists = this.props.allergies.some(a => a.id === allergy.id);
    
    if (alreadyExists) {
      // In a medical context, you might want to throw an error 
      // or simply return to avoid redundant data.
      throw new Error(`Allergy with ID ${allergy.id} is already recorded for this resident.`);
    }

    // 2. Business Rule: Perhaps check for duplicate names (optional but safer)
    const duplicateName = this.props.allergies.some(
      a => a.name.toLowerCase() === allergy.name.toLowerCase()
    );

    if (duplicateName) {
        // Log a warning or handle differently if the names match but IDs don't
    }

    // 3. Add to the private props
    this.props.allergies.push(allergy);
    
    // 4. Update the timestamp
    this.props.updatedAt = new Date();
  }

  public setPrimaryCaregiver(caregiverId: string | null): void {
    // 1. Logic Check: If the ID is already the same, do nothing to avoid redundant updates
    if (this.props.primaryCaregiverId === caregiverId) {
      return;
    }

    // 2. Domain Rule: You might want to prevent assigning a caregiver 
    // if the resident is currently DISCHARGED.
    if (this.props.status === ResidentStatus.DISCHARGED && caregiverId !== null) {
      throw new Error("Cannot assign a primary caregiver to a discharged resident.");
    }

    // 3. Update the internal property
    this.props.primaryCaregiverId = caregiverId;

    // 4. Update the audit timestamp
    this.props.updatedAt = new Date();

    // 5. Future-Proofing: This is where you would record a Domain Event
    // this.addDomainEvent(new PrimaryCaregiverChangedEvent(this.residentId, caregiverId));
  }

  /**
   * Adds a new recurring care rule to the resident's Care Plan.
   */
  public assignTaskTemplate(templateId: number): void {
    // Logic to prevent duplicate templates could go here
    // this.props.taskAssignments.push(TaskAssignment.create(...));
  }
}