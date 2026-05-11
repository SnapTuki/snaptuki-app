// src/domains/taskManagement/infrastructure/repos/PrismaTaskRepo.ts
import { ITaskRepo } from "../../../taskManagement/application/interfaces/ITaskRepo";
import { Task } from "../../../taskManagement/domain/entities/Task";
import { TaskMap } from "../mappers/TaskMap";
import { PrismaClient } from "../../../../generated/prisma";
import { Prisma } from "../../../../generated/prisma";
export class PrismaTaskRepo implements ITaskRepo {
  constructor(private readonly prisma: PrismaClient) { }

  async getById(id: string): Promise<Task | null> {
    const row = await this.prisma.task.findUnique({
      where: { id },
      include: {
        checklist: true, assignedCaregiver: {
          include: {
            user: true
          }
        }, resident: true
      },
    });
    return row ? TaskMap.toDomain(row) : null;
  }

  async list(params?: {
    take?: number; skip?: number; search?: string | null;
    status?: string | null; caregiverId?: string | null; residentId?: string | null;
    startDate?: Date | null; endDate?: Date | null;
  }): Promise<Task[]> {
    const { 
      take = 50, 
      skip = 0, 
      search, 
      status, 
      caregiverId, 
      residentId, 
      startDate, 
      endDate 
    } = params ?? {};

    // Build the dynamic filter object
    const where: any = {
      AND: [
        // Filter by specific resident or caregiver IDs if provided
        residentId ? { residentId } : {},
        caregiverId ? { assignedCaregiverId: caregiverId } : {},
        
        // Filter by Task Status (e.g., PENDING, COMPLETED)
        status ? { status } : {},

        // Date Range Filtering: Essential for "Today" and "Tomorrow" views
        startDate || endDate ? {
          dueAt: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate }),
          }
        } : {},

        // Full-text search across Title or Description
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        } : {},
      ]
    };

    const rows = await this.prisma.task.findMany({
      where,
      take,
      skip,
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      include: {
        checklist: true, 
        resident: true, 
        assignedCaregiver: {
          include: {
            user: true
          }
        }
      },
    });

    console.log(`Repo found ${rows.length} tasks matching criteria.`);
    return rows.map(TaskMap.toDomain);
  }

  async create(task: Task): Promise<void> {
    const data = TaskMap.toPersistence(task);
    console.log("Data in create tas repo: ", data)
    // We do NOT destructure here. 
    // We send the IDs directly to the columns defined by @map in your schema.
    await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        category: data.category,
        dueAt: data.dueAt,

       resident:{
        connect: {residentId: data.residentId}
       },

       ...(data.assignedCaregiverId && {
        assignedCaregiver:{
          connect: {id: data.assignedCaregiverId}
        }
       }),

        // Nested checklist creation
        checklist: {
          create: task.checklist.map(ci => ({
            id: ci.id,
            label: ci.label,
            isRequired: ci.required, // Ensure this matches your checklist model
            isCompleted: ci.done,
            completedAt: ci.doneAt || null,
          })),
        },
      }
    });
  }

  async save(task: Task): Promise<void> {
    const data = TaskMap.toPersistence(task);

    await this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: data.status,
        dueAt: data.dueAt,

        // Pass raw IDs directly
        residentId: data.residentId,
        // Handle the empty string issue (Postgres hates empty strings for FKs)
        assignedCaregiverId: data.assignedCaregiverId || null,

        // Sync the checklist
        checklist: {
        deleteMany: {},
        create: task.checklist.map(item => ({
          id: item.id,
          label: item.label,
          isRequired: item.required,
          isCompleted: item.done,
          completedAt: item.doneAt || null
        }))
      }
      } as Prisma.TaskUncheckedUpdateInput, // 🔥 THIS IS THE KEY
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}