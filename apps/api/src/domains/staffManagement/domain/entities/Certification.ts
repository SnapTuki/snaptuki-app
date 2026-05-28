// src/domains/caregiverManagement/domain/entities/Certification.ts

// 1. Define the flat read-only state for mappers/repositories
export interface CertificationState {
  id: string;
  name: string;
  issuer: string;
  validFrom: Date;
  validTo: Date | null;
}

export class Certification {
  // 2. Keep properties private to maintain strict encapsulation
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly issuer: string,
    private readonly validFrom: Date,
    private readonly validTo: Date | null
  ) {}

  public static create(props: {
    id: string; 
    name: string; 
    issuer: string; 
    validFrom: Date; 
    validTo?: Date | null;
  }) {
    if (!props.id || !props.name || !props.issuer || !props.validFrom) {
      throw new Error("Certification requires id, name, issuer, validFrom");
    }
    if (props.validTo && props.validTo < props.validFrom) {
      throw new Error("validTo cannot be before validFrom");
    }
    return new Certification(props.id, props.name, props.issuer, props.validFrom, props.validTo ?? null);
  }

  /**
   * --- THE SNAPSHOT ---
   * Safely exports the state representation of this entity
   */
  public snapshot(): CertificationState {
    return {
      id: this.id,
      name: this.name,
      issuer: this.issuer,
      validFrom: this.validFrom,
      validTo: this.validTo
    };
  }

  public static restore(snapshot : CertificationState){
    return new Certification(
      snapshot.id,
      snapshot.name,
      snapshot.issuer,
      snapshot.validFrom,
      snapshot.validTo
    );
  }

  /**
   * --- DOMAIN BEHAVIORS ---
   */
  public isExpired(reference: Date = new Date()): boolean {
    return this.validTo ? this.validTo < reference : false;
  }
}