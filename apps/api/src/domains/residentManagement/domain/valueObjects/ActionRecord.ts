// src/domains/residentManagement/domain/entities/ActionRecord.ts

export interface ActionRecordProps {
  id?: number;              // Database generated
  taskId: string;
  caregiverId: string;
  
  /**
   * The actual clinical data stored as a JSON object.
   * e.g., { systolic: 120, diastolic: 80, unit: "mmHg" }
   */
  value: any; 
  
  notes: string | null;
  createdAt: Date;
}

export class ActionRecord {
  private props: ActionRecordProps;

  private constructor(props: ActionRecordProps) {
    this.props = { ...props };
  }

  /**
   * Create a new record (e.g., when a caregiver submits a task result)
   */
  public static create(props: Omit<ActionRecordProps, 'id' | 'createdAt'>): ActionRecord {
    if (!props.value && !props.notes) {
      throw new Error("ActionRecord must contain either a value or a note.");
    }

    return new ActionRecord({
      ...props,
      createdAt: new Date()
    });
  }

  /**
   * Reconstitute from the database
   */
  public static rebuild(props: ActionRecordProps): ActionRecord {
    return new ActionRecord(props);
  }

  // --- Getters ---
  get id() { return this.props.id; }
  get taskId() { return this.props.taskId; }
  get caregiverId() { return this.props.caregiverId; }
  get value() { return this.props.value; }
  get notes() { return this.props.notes; }
  get createdAt() { return this.props.createdAt; }

  /**
   * Helper to extract specific clinical data safely
   */
  public getTypedValue<T>(): T {
    return this.props.value as T;
  }
}