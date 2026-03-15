// src/domains/taskManagement/domain/valueObjects/Description.ts
export class Description {
  private constructor(private readonly _value: string) {}

  static create(value: string | null | undefined) {
    if (!value) return null;
    const v = value.trim();
    return new Description(v);
  }

  get value() {
    return this._value;
  }
}