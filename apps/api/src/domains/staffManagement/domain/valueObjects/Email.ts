// src/domains/caregiverManagement/domain/valueObjects/Email.ts
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(private readonly _value: string) {}

  public static create(value: string) {
    const normalized = value?.trim().toLowerCase();
    if (!normalized || !EMAIL_REGEX.test(normalized)) {
      throw new Error("Invalid email");
    }
    return new Email(normalized);
  }

  public get value() { return this._value; }
}