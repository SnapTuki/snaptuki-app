// src/domains/residentManagement/domain/valueObjects/Hetu.ts
export class SSN {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(ssn: string): SSN {
    // 1. Validate Finnish HETU format (DDMMYY[+ - A]NNNC)
    const hetuRegex = /^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])\d{2}[+\-AUVWXY]\d{3}[0-9A-FHJ-NPR-Y]$/i;
    
    if (!hetuRegex.test(ssn)) {
      throw new Error("Invalid SSN format");
    }

    // 2. You can even add the modulo-31 checksum validation here
    // to guarantee it is a mathematically valid Finnish SSN.

    return new SSN(ssn.toUpperCase());
  }

  public getValue(): string {
    return this.value;
  }
}