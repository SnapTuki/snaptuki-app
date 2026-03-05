// src/domains/caregiverManagement/domain/valueObjects/CaregiverId.ts
export class CaregiverId {
  private constructor(private readonly _value: string) {}

  public static create(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("CaregiverId cannot be empty");
    }
    return new CaregiverId(value);
  }

  public get value() {
    return this._value;
  }
}