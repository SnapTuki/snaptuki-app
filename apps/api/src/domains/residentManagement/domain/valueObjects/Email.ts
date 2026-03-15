// src/domains/residentManagement/domain/valueObjects/Email.ts
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(private readonly _value: string) {}

  public static create(value: string | null | undefined) {
    if (!value) return null;
    const normalized = value.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalized)) throw new Error("Invalid email");
    return new Email(normalized);
  }

  public get value() { return this._value; }
}