// src/domains/taskManagement/domain/entities/Task.ts
import { Title } from "../valueObjects/Title";
import { Description } from "../valueObjects/Description";
import { ChecklistItem } from "./ChecklistItem";
import { TaskPriority } from "../../../../generated/prisma";
import { TaskStatus } from "../../../../generated/prisma";
import { TaskCategory } from "../../../../generated/prisma";

export interface TaskProps {
  id: string;
  title: Title;
  description: Description | null;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;

  residentId?: string | null;
  resident?: any;
  assignedCaregiverId?: string | null;

  dueAt?: Date | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  completedByCaregiverId?: string | null;
  completionNotes?: string | null;

  checklist: ChecklistItem[];

  createdByUserId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task {
  private props: TaskProps;

  private constructor(props: TaskProps) {
    this.props = { ...props };
  }

  static create(props: TaskProps): Task {
    if (!props.id || !props.title || !props.category || !props.priority || !props.createdByUserId) {
      throw new Error("Missing required Task properties");
    }
    return new Task({
      ...props,
      description: props.description ?? null,
      status: props.status ?? "PENDING",
      residentId: props.residentId ?? null,
      assignedCaregiverId: props.assignedCaregiverId ?? null,
      startedAt: props.startedAt ?? null,
      completedAt: props.completedAt ?? null,
      completedByCaregiverId: props.completedByCaregiverId ?? null,
      completionNotes: props.completionNotes ?? null,
      checklist: props.checklist ?? [],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  // Getters
  get id() { return this.props.id; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get category() { return this.props.category; }
  get priority() { return this.props.priority; }
  get status() { return this.props.status; }

  get residentId() { return this.props.residentId ?? null; }
  get resident(){return this.props.resident;}
  get assignedCaregiverId() { return this.props.assignedCaregiverId ?? null; }

  get dueAt(){return this.props.dueAt ?? null;}
  get startedAt() { return this.props.startedAt ?? null; }
  get completedAt() { return this.props.completedAt ?? null; }
  get completedByCaregiverId() { return this.props.completedByCaregiverId ?? null; }
  get completionNotes() { return this.props.completionNotes ?? null; }
  get checklist() { return [...this.props.checklist]; }

  get createdByUserId() { return this.props.createdByUserId; }
  get createdAt() { return this.props.createdAt ?? new Date(); }
  get updatedAt() { return this.props.updatedAt ?? new Date(); }

  // Behaviors
  assign(caregiverId: string) {
    this.props.assignedCaregiverId = caregiverId;
    this.props.status = this.props.status === "PENDING" ? "ASSIGNED" : this.props.status;
    this.touch();
  }

  start(now: Date = new Date()) {
    if (this.props.status === "COMPLETED" || this.props.status === "CANCELLED") {
      throw new Error("Cannot start a completed or cancelled task");
    }
    this.props.status = "IN_PROGRESS";
    this.props.startedAt = now;
    this.touch();
  }

  complete(byCaregiverId: string, notes?: string | null, now: Date = new Date()) {
    if (this.props.status === "CANCELLED") throw new Error("Cannot complete a cancelled task");
    this.props.status = "COMPLETED";
    this.props.completedAt = now;
    this.props.completedByCaregiverId = byCaregiverId;
    this.props.completionNotes = notes ?? null;
    this.touch();
  }

  cancel(reason?: string | null) {
    this.props.status = "CANCELLED";
    this.props.completionNotes = reason ?? this.props.completionNotes ?? null;
    this.touch();
  }

  addChecklistItem(item: ChecklistItem) {
    const exists = this.props.checklist.find(i => i.id === item.id);
    if (!exists) this.props.checklist.push(item);
    this.touch();
  }

  toggleChecklistItem(itemId: string, done: boolean, byCaregiverId: string | null) {
    const item = this.props.checklist.find(i => i.id === itemId);
    if (!item) throw new Error("Checklist item not found");
    item.toggle(done, byCaregiverId);
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}