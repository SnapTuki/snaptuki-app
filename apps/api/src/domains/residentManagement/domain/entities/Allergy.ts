// src/domains/residentManagement/domain/entities/Allergy.ts
export type AllergySeverity = "MILD" | "MODERATE" | "SEVERE";

export class Allergy {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly reaction: string,
    public readonly severity: AllergySeverity,
    public readonly notes: string | null
  ) {}

  public static create(props: {
    id: string;
    name: string;
    reaction: string;
    severity: AllergySeverity;
    notes?: string | null;
  }) {
    if (!props.id || !props.name || !props.reaction || !props.severity) {
      throw new Error("Allergy requires id, name, reaction, severity");
    }
    return new Allergy(props.id, props.name, props.reaction, props.severity, props.notes ?? null);
  }
}