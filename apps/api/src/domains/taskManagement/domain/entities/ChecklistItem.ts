// src/domains/taskManagement/domain/entities/ChecklistItem.ts
export class ChecklistItem {
  private constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly required: boolean,
    public done: boolean,
    public doneAt: Date | null,
    public doneByCaregiverId: string | null
  ) {}

  static create(props: {
    id: string; label: string; required?: boolean;
    done?: boolean; doneAt?: Date | null; doneByCaregiverId?: string | null;
  }) {
    if (!props.id || !props.label?.trim()) throw new Error("ChecklistItem requires id and label");
    return new ChecklistItem(
      props.id,
      props.label.trim(),
      props.required ?? false,
      props.done ?? false,
      props.doneAt ?? null,
      props.doneByCaregiverId ?? null
    );
  }

  toggle(done: boolean, byCaregiverId: string | null) {
    this.done = done;
    this.doneAt = done ? new Date() : null;
    this.doneByCaregiverId = done ? byCaregiverId : null;
  }
}