// src/domains/taskManagement/infrastructure/repos/PrismaTaskRepo.ts
import { ITaskRepo } from "../../../taskManagement/application/interfaces/ITaskRepo";
import { Task } from "../../../taskManagement/domain/entities/Task";
import { TaskMap } from "../mappers/TaskMap";
import { PrismaClient } from "../../../../generated/prisma";

export class PrismaTaskRepo implements ITaskRepo {
  constructor(private readonly prisma: PrismaClient){}

  async getById(id: string): Promise<Task | null> {
    const row = await this.prisma.task.findUnique({
      where: { id },
      include: { checklist: true },
    });
    return row ? TaskMap.toDomain(row) : null;
  }

  async list(params?: {
    take?: number; skip?: number; search?: string | null;
    status?: string | null; caregiverId?: string | null; residentId?: string | null;
    fromDueAt?: Date | null; toDueAt?: Date | null;
  }): Promise<Task[]> {
    const { take = 50, skip = 0, search, status, caregiverId, residentId, fromDueAt, toDueAt } = params ?? {};
    const rows = await this.prisma.task.findMany({
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      include: { checklist: true, resident: true, template: true },
    });
    return rows.map(TaskMap.toDomain);
  }

  async create(task: Task): Promise<void> {
    const data = TaskMap.toPersistence(task);
    await this.prisma.task.create({
      data: {
        ...data,
        checklist: {
          create: task.checklist.map(ci => ({
            id: ci.id,
            label: ci.label,
            required: ci.required,
            done: ci.done,
            doneAt: ci.doneAt,
            doneByCaregiverId: ci.doneByCaregiverId,
          })),
        },
      },
    });
  }

  async save(task: Task): Promise<void> {
    const data = TaskMap.toPersistence(task);
    await this.prisma.task.update({
      where: { id: task.id },
      data,
    });
    // Checklist updates occur via dedicated mutations/use-cases
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}