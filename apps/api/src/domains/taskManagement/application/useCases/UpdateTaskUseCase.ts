// src/domains/taskManagement/application/useCases/UpdateTaskUseCase.ts

import { randomUUID } from "crypto"; // <-- Required for generating new checklist item IDs
import { ITaskRepo } from "../interfaces/ITaskRepo";
import { TaskPriority } from "../../domain/entities/Task";
import { TaskMap } from "../../infrastructure/mappers/TaskMap";
import { TaskDTO } from "../dtos/TaskDTO";

// 1. Define the Checklist Input structure
export interface ChecklistItemInputDTO {
  id?: string; // Optional: If missing, the Use Case will generate one
  label: string;
}

// 2. Add the checklist to the main Input interface
export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  dueAt?: Date | null;
  assignedCaregiverId?: string | null;
  checklist?: ChecklistItemInputDTO[]; // <-- Now TypeScript knows about this!
}

export class UpdateTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepo) {}

  public async execute(input: UpdateTaskInput): Promise<{ task: TaskDTO }> {
    // 1. Fetch the Aggregate Root
    const task = await this.taskRepo.getById(input.id);
    if (!task) {
      throw new Error(`Task with ID ${input.id} not found.`);
    }

    // 2. Apply updates to the core scalar fields
    task.update({
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueAt: input.dueAt,
    });

    // 3. Trigger specific domain behaviors explicitly
    if (input.assignedCaregiverId !== undefined) {
      if (input.assignedCaregiverId === null) {
        task.unassign();
      } else {
        task.assign(input.assignedCaregiverId);
      }
    }

    // 4. Update Checklist if provided
    if (input.checklist) {
      const mappedChecklist = input.checklist.map(item => ({
        id: item.id || randomUUID(), // Guarantee every item has an ID before hitting the Domain
        label: item.label,
      }));
      
      task.updateChecklist(mappedChecklist);
    }

    // 5. Persist the updated aggregate via the unified Upsert pattern
    await this.taskRepo.save(task); 

    // 6. Safely transform and return the presentation layer payload
    return { task: TaskMap.toDTO(task) };
  }
}