// src/domains/caregiverManagement/domain/valueObjects/Name.ts
export class Name {
  private constructor(
    private readonly _first: string,
    private readonly _last: string
  ) {}

  public static create(first: string, last: string) {
    if (!first?.trim() || !last?.trim()) {
      throw new Error("Name requires first and last");
    }
    return new Name(first.trim(), last.trim());
  }

  public get first() { return this._first; }
  public get last() { return this._last; }
  public get full() { return `${this._first} ${this._last}`; }
}