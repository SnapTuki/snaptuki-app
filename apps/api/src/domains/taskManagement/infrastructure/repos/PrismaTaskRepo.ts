// src/domains/taskManagement/infrastructure/repos/PrismaTaskRepo.ts
import prisma from "../../../../prisma/client";
import { ITaskRepo } from "../../../taskManagement/application/interfaces/ITaskRepo";
import { Task } from "../../../taskManagement/domain/entities/Task";
import { TaskMap } from "../mappers/TaskMap";

export class PrismaTaskRepo implements ITaskRepo {
  async getById(id: string): Promise<Task | null> {
    const row = await prisma.task.findUnique({
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
    const rows = await prisma.task.findMany({
      where: {
        AND: [
          status ? { status: status as any } : {},
          caregiverId ? { assignedCaregiverId: caregiverId } : {},
          residentId ? { residentId } : {},
          search ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ]
          } : {},
          fromDueAt ? { dueAt: { gte: fromDueAt } } : {},
          toDueAt ? { dueAt: { lte: toDueAt } } : {},
        ]
      },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      take, skip,
      include: { checklist: true },
    });
    return rows.map(TaskMap.toDomain);
  }

  async create(task: Task): Promise<void> {
    const data = TaskMap.toPersistence(task);
    await prisma.task.create({
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
    await prisma.task.update({
      where: { id: task.id },
      data,
    });
    // Checklist updates occur via dedicated mutations/use-cases
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } });
  }
}