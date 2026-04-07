// src/domains/residentManagement/domain/entities/ChecklistItem.ts
export interface ChecklistItemProps {
  id: string;
  label: string;
  isRequired: boolean;
  isCompleted: boolean;
  completedAt?: Date | null;
}

export class ChecklistItem {
  private props: ChecklistItemProps;

  constructor(props: ChecklistItemProps) {
    this.props = { ...props };
  }

  get id() { return this.props.id; }
  get label() { return this.props.label; }
  get isRequired() { return this.props.isRequired; }
  get isCompleted() { return this.props.isCompleted; }

  public toggle(): void {
    this.props.isCompleted = !this.props.isCompleted;
    this.props.completedAt = this.props.isCompleted ? new Date() : null;
  }
}