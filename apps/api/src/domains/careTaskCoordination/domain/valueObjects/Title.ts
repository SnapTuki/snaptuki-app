export class Title {
  private constructor(private readonly _value: string) {}

  static create(value: string) {
    const v = value?.trim();
    if (!v || v.length < 3) throw new Error("Title must be at least 3 characters");
    return new Title(v);
  }

  get value() {
    return this._value;
  }
}