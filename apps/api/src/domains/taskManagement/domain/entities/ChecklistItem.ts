// src/domains/taskManagement/domain/entities/ChecklistItem.ts

export interface UpdateChecklistItemProps {
  label?: string;
  required?: boolean;
}

export class ChecklistItem {
  private constructor(
    public readonly id: string,
    private _label: string,      // Changed to private to control updates
    private _required: boolean,  // Changed to private
    public done: boolean,
    public doneAt: Date | null,
    public doneByCaregiverId: string | null
  ) {}

  // Getters to maintain read access
  get label() { return this._label; }
  get required() { return this._required; }

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

  // 🔥 NEW: Method for supervisors to edit the protocol definition
  update(props: UpdateChecklistItemProps) {
    if (props.label !== undefined) {
      if (!props.label.trim()) throw new Error("Label cannot be empty");
      this._label = props.label.trim();
    }
    if (props.required !== undefined) {
      this._required = props.required;
    }
  }

  toggle(done: boolean, byCaregiverId: string | null) {
    this.done = done;
    this.doneAt = done ? new Date() : null;
    this.doneByCaregiverId = done ? byCaregiverId : null;
  }
}