// src/domains/residentManagement/domain/entities/Medication.ts
export class Medication {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly dosage: string,
    public readonly frequency: string,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly prescribedBy: string | null
  ) {}

  public static create(props: {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    endDate?: Date | null;
    prescribedBy?: string | null;
  }) {
    if (!props.id || !props.name || !props.dosage || !props.frequency || !props.startDate) {
      throw new Error("Medication requires id, name, dosage, frequency, startDate");
    }
    if (props.endDate && props.endDate < props.startDate) {
      throw new Error("Medication endDate cannot be before startDate");
    }
    return new Medication(
      props.id,
      props.name,
      props.dosage,
      props.frequency,
      props.startDate,
      props.endDate ?? null,
      props.prescribedBy ?? null
    );
  }
}