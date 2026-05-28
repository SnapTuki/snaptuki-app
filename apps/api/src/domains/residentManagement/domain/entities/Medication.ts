// src/domains/residentManagement/domain/entities/Medication.ts

// 1. Explicit Read-Only State for the Mapper and Snapshot
export interface MedicationState {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate: Date | null;
  prescribedBy: string | null;
}

// 2. Internal Encapsulated Props
interface MedicationProps {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate: Date | null;
  prescribedBy: string | null;
}

export class Medication {
  private props: MedicationProps;

  private constructor(props: MedicationProps) {
    this.props = { ...props };
  }

  /**
   * --- DOMAIN FACTORY: For prescribing a BRAND NEW medication ---
   */
  public static createNew(props: {
    id: string; // The Orchestrator/Use Case should generate this
    name: string;
    dosage: string;
    frequency: string;
    startDate?: Date; // Defaults to now if not provided
    endDate?: Date | null;
    prescribedBy?: string | null;
  }): Medication {
    if (!props.id || !props.name || !props.dosage || !props.frequency) {
      throw new Error("Medication requires id, name, dosage, and frequency");
    }

    const startDate = props.startDate ?? new Date();

    // Preserve your excellent business logic
    if (props.endDate && props.endDate < startDate) {
      throw new Error("Medication endDate cannot be before startDate");
    }

    return new Medication({
      id: props.id,
      name: props.name.trim(),
      dosage: props.dosage.trim(),
      frequency: props.frequency.trim(),
      startDate: startDate,
      endDate: props.endDate ?? null,
      prescribedBy: props.prescribedBy ? props.prescribedBy.trim() : null,
    });
  }

  /**
   * --- REHYDRATION FACTORY: For loading from Prisma ---
   */
  public static restore(snapshot: MedicationState): Medication {
    return new Medication({ ...snapshot });
  }

  /**
   * --- THE SNAPSHOT PATTERN ---
   */
  public snapshot(): MedicationState {
    return {
      id: this.props.id,
      name: this.props.name,
      dosage: this.props.dosage,
      frequency: this.props.frequency,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      prescribedBy: this.props.prescribedBy,
    };
  }

  /**
   * --- SELECTIVE GETTERS (For Aggregate Root Rules Only) ---
   * Identity is exposed so the Resident aggregate can find/update specific medications.
   */
  get id(): string {
    return this.props.id;
  }

  /**
   * --- DOMAIN BEHAVIORS ---
   * Handled locally, but saved when the parent `Resident` aggregate is saved.
   */

  /**
   * Discontinues the medication, effectively stopping it.
   */
  public discontinue(endDate: Date = new Date()): void {
    if (endDate < this.props.startDate) {
      throw new Error("Discontinuation date cannot be before the start date.");
    }
    this.props.endDate = endDate;
  }

  /**
   * Updates the dosage instructions for an active medication.
   */
  public updateInstructions(dosage: string, frequency: string): void {
    if (!dosage.trim() || !frequency.trim()) {
      throw new Error("Dosage and frequency cannot be empty.");
    }
    this.props.dosage = dosage.trim();
    this.props.frequency = frequency.trim();
  }

  /**
   * Utility Domain Logic: Instantly check if the medication is currently active.
   */
  public isActive(atDate: Date = new Date()): boolean {
    if (atDate < this.props.startDate) return false;
    if (this.props.endDate && atDate > this.props.endDate) return false;
    return true;
  }
}