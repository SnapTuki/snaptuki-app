// src/domains/residentManagement/domain/valueObjects/PhoneNumber.ts
export class PhoneNumber {
  private constructor(private readonly _value: string) {}

  public static create(value: string | null | undefined) {
    if (!value) return null;
    const digits = value.replace(/[^\d+]/g, "");
    if (digits.length < 3) throw new Error("Invalid phone number");
    return new PhoneNumber(digits);
  }

  public get value() { return this._value; }
}