export class Email {
  private constructor(private readonly value: string) {}

  static create(raw: string): Email {
    const normalized = raw.trim().toLowerCase();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
    if (!ok) throw new Error('Invalid email format');
    return new Email(normalized);
  }

  toString() {
    return this.value;
  }

  equals(other: Email) {
    return this.value === other.value;
  }
}