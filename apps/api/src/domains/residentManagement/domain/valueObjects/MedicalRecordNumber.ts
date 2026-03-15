// src/domains/residentManagement/domain/valueObjects/MedicalRecordNumber.ts
export class MedicalRecordNumber {
  private constructor(private readonly _value: string) {}

  public static create(value: string) {
    const v = value?.trim();
    if (!v || v.length < 4) {
      throw new Error("MRN must be at least 4 characters");
    }
    return new MedicalRecordNumber(v);
  }

  public get value() { return this._value; }
}