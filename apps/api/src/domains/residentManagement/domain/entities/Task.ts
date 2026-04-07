// src/domains/residentManagement/domain/entities/Task.ts
import { TaskStatus, TaskPriority, TaskCategory } from "../../../../generated/prisma";
import { ChecklistItem } from "./ChecklistItem"; // We'll define this below
import { ActionRecord } from "../valueObjects/ActionRecord";

export interface TaskProps {
  id: string;
  templateId?: number | null;
  residentId: string;
  visitId?: string | null;
  
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  
  dueAt: Date;
  startedAt?: Date | null;
  completedAt?: Date | null;
  completionNotes?: string | null;
  
  checklist: ChecklistItem[];
  actionRecords: ActionRecord[];
  
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task {
  private props: TaskProps;

  private constructor(props: TaskProps) {
    this.props = { ...props };
  }

  /**
   * Factory for creating a Task from a Template (The "Spawn" logic)
   */
  public static createFromTemplate(props: {
    templateId: number;
    residentId: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueAt: Date;
    checklist: ChecklistItem[];
  }): Task {
    return new Task({
      ...props,
      id: "", // Assigned by DB
      status: TaskStatus.PENDING,
      checklist: props.checklist,
      actionRecords: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * Reconstitute from Persistence (Prisma)
   */
  public static rebuild(props: TaskProps): Task {
    return new Task(props);
  }

  // --- Getters ---
  get id() { return this.props.id; }
  get status() { return this.props.status; }
  get category() { return this.props.category; }
  get dueAt() { return this.props.dueAt; }
  get checklist() { return [...this.props.checklist]; }
  get actionRecords() { return [...this.props.actionRecords]; }
  get priority() { return this.props.priority; }
  get completedAt() { return  this.props.completedAt;} 
  get completionNotes(){return this.props.completionNotes;}
  // --- Domain Behaviors ---

  /**
   * Transitions the task to In Progress when a caregiver starts a visit.
   */
  public start(visitId: string): void {
    if (this.props.status !== TaskStatus.PENDING) {
      throw new Error("Task can only be started from PENDING status.");
    }
    this.props.status = TaskStatus.IN_PROGRESS;
    this.props.visitId = visitId;
    this.props.startedAt = new Date();
  }

  /**
   * Completes the task. Ensures all required checklist items are done.
   */
  public complete(notes?: string): void {
    const missingRequired = this.props.checklist.some(item => item.isRequired && !item.isCompleted);
    
    if (missingRequired) {
      throw new Error("Cannot complete task: required checklist items are missing.");
    }

    this.props.status = TaskStatus.COMPLETED;
    this.props.completedAt = new Date();
    this.props.completionNotes = notes;
  }

  public cancel(reason: string): void {
    this.props.status = TaskStatus.CANCELLED;
    this.props.completionNotes = reason;
  }
}