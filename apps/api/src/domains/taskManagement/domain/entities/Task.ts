// src/domains/taskManagement/domain/entities/Task.ts
import { Title } from "../valueObjects/Title";
import { Description } from "../valueObjects/Description";
import { ChecklistItem } from "./ChecklistItem";
import { TaskPriority, TaskStatus, TaskCategory } from "../../../../generated/prisma";

export interface TaskProps {
  id?: string;
  title: Title;
  description: Description | null;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;

  residentId: string | null;
  resident?: any; // For carrying resident metadata in the domain
  assignedCaregiverId: string | null;
  assignedCaregiver: any;

  dueAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  completedByCaregiverId: string | null;
  completionNotes: string[] | null;

  checklist: ChecklistItem[];

  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateTaskProps {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assignedCaregiverId?: string;
  dueAt?: Date;
  checklist?: Array<{
    id?: string;
    label: string;
    isRequired: boolean;
  }>;
}

export class Task {
  private props: TaskProps;

  private constructor(props: TaskProps) {
    this.props = { ...props };
  }

  static create(props: Partial<TaskProps> & { title: Title; createdByUserId: string; }): Task {
    // Enforcement of required Prisma fields
    if (!props.title || !props.createdByUserId) {
      throw new Error("Missing critical Task properties");
    }

    return new Task({
      id: props.id || crypto.randomUUID(),
      title: props.title,
      description: props.description ?? null,
      category: props.category ?? "CARE", // Default to General Care
      priority: props.priority ?? "MEDIUM",
      status: props.status ?? "PENDING",
      residentId: props.residentId ?? null,
      resident: props.resident,
      assignedCaregiverId: props.assignedCaregiverId ?? null,
      assignedCaregiver: props.assignedCaregiver,
      dueAt: props.dueAt ?? null,
      startedAt: props.startedAt ?? null,
      completedAt: props.completedAt ?? null,
      completedByCaregiverId: props.completedByCaregiverId ?? null,
      completionNotes: props.completionNotes ?? null,
      checklist: props.checklist ?? [],
      createdByUserId: props.createdByUserId,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  public update(props: UpdateTaskProps): void {
    // 1. Validate Business Rules
    if (props.title !== undefined && props.title.trim() === '') {
      throw new Error("Task title cannot be empty.");
    }

    // 3. Apply basic field updates
    if (props.title) this.props.title = Title.create(props.title);
    if (props.description !== undefined) this.props.description = Description.create(props.description);
    if (props.priority) this.props.priority = props.priority as TaskPriority;
    if (props.dueAt) this.props.dueAt = props.dueAt;

    // 4. Handle Caregiver Assignment logic
    if (props.assignedCaregiverId !== undefined) {
      this.props.assignedCaregiverId = props.assignedCaregiverId;
      
      // Auto-transition status if a caregiver is assigned to a PENDING task
      if (this.props.assignedCaregiverId && this.props.status === 'PENDING') {
        this.props.status = 'ASSIGNED' as TaskStatus;
      }
    }

    // 5. Update Checklist
    if (props.checklist) {
      // Logic to sync checklist items (add new, update existing, remove old)
      this.updateChecklist(props.checklist);
    }

    // 6. Record the update time
    this.props.updatedAt = new Date();
  }

  // --- Getters ---
  get id() { return this.props.id; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get category() { return this.props.category; }
  get priority() { return this.props.priority; }
  get status() { return this.props.status; }

  get residentId() { return this.props.residentId; }
  get resident() { return this.props.resident; }
  get assignedCaregiverId() { return this.props.assignedCaregiverId; }
  get assignedCaregiver() {return this.props.assignedCaregiver;}

  get dueAt() { return this.props.dueAt; }
  get startedAt() { return this.props.startedAt; }
  get completedAt() { return this.props.completedAt; }
  get completedByCaregiverId() { return this.props.completedByCaregiverId; }
  get completionNotes() { return this.props.completionNotes; }
  get checklist() { return [...this.props.checklist]; }

  get createdByUserId() { return this.props.createdByUserId; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  // --- Domain Behaviors ---

  assign(caregiverId: string) {
    this.props.assignedCaregiverId = caregiverId;
    // If it's pending, move to assigned status automatically
    if (this.props.status === "PENDING") {
      this.props.status = "ASSIGNED";
    }
    this.touch();
  }

  unassign() {
    this.props.assignedCaregiverId = null;
    if (this.props.status === "ASSIGNED") {
      this.props.status = "PENDING";
    }
    this.touch();
  }

  start(now: Date = new Date()) {
    if (this.props.status === "COMPLETED" || this.props.status === "CANCELLED") {
      throw new Error("Cannot start a finished task");
    }
    this.props.status = "IN_PROGRESS";
    this.props.startedAt = now;
    this.touch();
  }

  complete(byCaregiverId: string, notes?: string[] | null, now: Date = new Date()) {
    if (this.props.status === "CANCELLED") throw new Error("Cannot complete a cancelled task");
    
    // Ensure all required checklist items are done (Optional Domain Rule)
    const pendingItems = this.props.checklist.filter(item => !item.done);
    if (pendingItems.length > 0) {
        // You can choose to throw an error or just mark them as done
    }

    this.props.status = "COMPLETED";
    this.props.completedAt = now;
    this.props.completedByCaregiverId = byCaregiverId;
    this.props.completionNotes = notes ?? this.props.completionNotes;
    this.touch();
  }

  cancel(reason: string[], now: Date = new Date()) {
    this.props.status = "CANCELLED";
    this.props.completionNotes = reason;
    this.touch();
  }

  updatePriority(priority: TaskPriority) {
    this.props.priority = priority;
    this.touch();
  }

  addChecklistItem(item: ChecklistItem) {
    const exists = this.props.checklist.find(i => i.id === item.id);
    if (!exists) {
        this.props.checklist.push(item);
    }
    this.touch();
  }

  public toggleChecklistItem(itemId: string, done: boolean, byCaregiverId: string | null): void {
    // 1. Business Rule: Cannot modify a cancelled or already completed task
    if (this.props.status === "CANCELLED") {
      throw new Error("Cannot update checklist on a cancelled task.");
    }

    // 2. Find the specific item within the internal props
    const item = this.props.checklist.find((i) => i.id === itemId);
    
    if (!item) {
      throw new Error(`Checklist item with ID ${itemId} not found in Task ${this.id}`);
    }

    // 3. Delegate the toggle logic to the ChecklistItem Entity/Value Object
    // This ensures any rules within the ChecklistItem (like mandatory comments) are respected
    item.toggle(done, byCaregiverId);

    // 4. Secondary Business Rule: Auto-update Task Status
    // If we start checking items, and the task was just 'ASSIGNED', move it to 'IN_PROGRESS'
    if (done && this.props.status === "ASSIGNED") {
      this.props.status = "IN_PROGRESS";
      this.props.startedAt = this.props.startedAt ?? new Date();
    }

    // 5. Update the task's modification timestamp
    this.touch();
  }

  
  private touch() {
    this.props.updatedAt = new Date();
  }

  private updateChecklist(newItems: any[]): void {
  const existingMap = new Map(this.props.checklist.map(i => [i.id, i]));
  
  const synchronizedList = newItems.map(incoming => {
    const existing = existingMap.get(incoming.id);

    if (existing) {
      // 1. UPDATE EXISTING: Identity is preserved
      existing.update({
        label: incoming.label,
        required: incoming.required
      });
      return existing;
    } else {
      // 2. CREATE NEW: For items added in the UI
      return ChecklistItem.create({
        id: incoming.id || crypto.randomUUID(), // Generate ID if it's brand new
        label: incoming.label,
        required: incoming.required
      });
    }
  });

  this.props.checklist = synchronizedList;
}
}