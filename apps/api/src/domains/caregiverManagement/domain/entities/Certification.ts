// src/domains/caregiverManagement/domain/entities/Certification.ts
export class Certification {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly issuer: string,
    public readonly validFrom: Date,
    public readonly validTo: Date | null
  ) {}

  public static create(props: {
    id: string; name: string; issuer: string; validFrom: Date; validTo?: Date | null;
  }) {
    if (!props.id || !props.name || !props.issuer || !props.validFrom) {
      throw new Error("Certification requires id, name, issuer, validFrom");
    }
    if (props.validTo && props.validTo < props.validFrom) {
      throw new Error("validTo cannot be before validFrom");
    }
    return new Certification(props.id, props.name, props.issuer, props.validFrom, props.validTo ?? null);
  }

  public isExpired(reference: Date = new Date()) {
    return this.validTo ? this.validTo < reference : false;
  }
}