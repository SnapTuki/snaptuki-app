// src/domains/taskManagement/application/useCases/AssignTaskUseCase.ts
import { ITaskRepo } from "../interfaces/ITaskRepo";
import { Task, TaskCategory, TaskPriority } from "../../../taskManagement/domain/entities/Task";
import { Title } from "../../../taskManagement/domain/valueObjects/Title";
import { Description } from "../../../taskManagement/domain/valueObjects/Description";
import { ChecklistItem } from "../../../taskManagement/domain/entities/ChecklistItem";

export interface AssignTaskInput {
  id: string;
  title: string;
  description?: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  residentId?: string | null;
  assignedCaregiverId: string;
  dueAt?: string | null;
  checklist?: { id: string; label: string; required?: boolean }[];
  createdByUserId: string;
}

export class AssignTaskUseCase {
  constructor(
    private repo: ITaskRepo,

  ) {}

  public async execute(input: AssignTaskInput): Promise<Task> {
    

    const task = Task.create({
      id: input.id,
      title: Title.create(input.title),
      description: Description.create(input.description ?? null),
      category: input.category,
      priority: input.priority,
      status: "ASSIGNED",
      residentId: input.residentId ?? null,
      assignedCaregiverId: input.assignedCaregiverId,
      checklist: (input.checklist ?? []).map(ci => ChecklistItem.create({
        id: ci.id, label: ci.label, required: ci.required ?? false
      })),
      createdByUserId: input.createdByUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.repo.create(task);
    return task;
  }
}