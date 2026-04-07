// src/domains/residentManagement/domain/entities/TaskAssignment.ts
export interface TaskAssignmentProps {
  id: number;
  residentId: string;
  taskTemplateId: number;
  isActive: boolean;
  createdAt: Date;
  // Optional: Include the template details if you want a Rich Entity
  taskTemplate?: {
    name: string;
    category: string;
  };
}

export class TaskAssignment {
  private props: TaskAssignmentProps;

  private constructor(props: TaskAssignmentProps) {
    this.props = { ...props };
  }

  /**
   * Factory method to create a new assignment (e.g., when a nurse 
   * adds a new recurring task to a resident's care plan).
   */
  public static create(props: Omit<TaskAssignmentProps, 'id' | 'createdAt' | 'isActive'>): TaskAssignment {
    return new TaskAssignment({
      ...props,
      id: 0, // ID will be assigned by the DB/Repository
      isActive: true,
      createdAt: new Date(),
    });
  }

  /**
   * Reconstitute an existing assignment from the database.
   */
  public static rebuild(props: TaskAssignmentProps): TaskAssignment {
    return new TaskAssignment(props);
  }

  // --- Getters ---
  get id() { return this.props.id; }
  get residentId() { return this.props.residentId; }
  get taskTemplateId() { return this.props.taskTemplateId; }
  get isActive() { return this.props.isActive; }
  get createdAt() { return this.props.createdAt; }
  get templateName() { return this.props.taskTemplate?.name; }

  // --- Domain Behaviors ---

  /**
   * Pauses the recurring task (e.g., if the resident is temporarily 
   * hospitalized or doesn't need this care right now).
   */
  public deactivate(): void {
    this.props.isActive = false;
  }

  /**
   * Resumes the care plan rule.
   */
  public activate(): void {
    this.props.isActive = true;
  }

  /**
   * Check if this assignment is valid for today's task generation.
   */
  public canGenerateTask(): boolean {
    return this.props.isActive;
  }
}