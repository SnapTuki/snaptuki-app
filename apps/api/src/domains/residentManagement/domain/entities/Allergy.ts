// src/domains/residentManagement/domain/entities/Allergy.ts

export enum AllergySeverity {
  MILD = "MILD",
  MODERATE = "MODERATE",
  SEVER = "SEVERE"
}

// 1. Explicit Read-Only State for the Mapper and Snapshot
export interface AllergyState {
  id: string;
  name: string;
  reaction: string;
  severity: AllergySeverity;
  notes: string | null;
}

// 2. Internal Encapsulated Props
interface AllergyProps {
  id: string;
  name: string;
  reaction: string;
  severity: AllergySeverity;
  notes: string | null;
}

export class Allergy {
  private props: AllergyProps;

  private constructor(props: AllergyProps) {
    this.props = { ...props };
  }

  /**
   * --- DOMAIN FACTORY: For adding a BRAND NEW allergy to a resident ---
   */
  public static createNew(props: {
    id: string; // The Use Case or Orchestrator should generate this (e.g., crypto.randomUUID())
    name: string;
    reaction: string;
    severity: AllergySeverity;
    notes?: string | null;
  }): Allergy {
    if (!props.id || !props.name || !props.reaction || !props.severity) {
      throw new Error("Allergy requires id, name, reaction, and severity");
    }

    return new Allergy({
      id: props.id,
      name: props.name.trim(),
      reaction: props.reaction.trim(),
      severity: props.severity,
      notes: props.notes ? props.notes.trim() : null,
    });
  }

  /**
   * --- REHYDRATION FACTORY: For loading from Prisma ---
   */
  public static restore(snapshot: AllergyState): Allergy {
    return new Allergy({ ...snapshot });
  }

  /**
   * --- THE SNAPSHOT PATTERN ---
   */
  public snapshot(): AllergyState {
    return {
      id: this.props.id,
      name: this.props.name,
      reaction: this.props.reaction,
      severity: this.props.severity,
      notes: this.props.notes,
    };
  }

  /**
   * --- SELECTIVE GETTERS (For Aggregate Root Rules Only) ---
   * In DDD, exposing the ID is perfectly acceptable because identity is immutable.
   * We also expose 'name' specifically so the Resident aggregate can check for duplicate allergies.
   */
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  /**
   * --- DOMAIN BEHAVIORS ---
   * Because it is a Child Entity, mutations here will eventually be saved 
   * when the parent `Resident` aggregate is passed to the repository.
   */
  public updateSeverity(newSeverity: AllergySeverity): void {
    this.props.severity = newSeverity;
  }

  public updateDetails(reaction: string, notes: string | null): void {
    if (!reaction.trim()) throw new Error("Reaction cannot be empty.");
    this.props.reaction = reaction.trim();
    this.props.notes = notes ? notes.trim() : null;
  }
}