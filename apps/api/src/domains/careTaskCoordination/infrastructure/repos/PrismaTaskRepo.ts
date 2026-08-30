// src/domains/taskManagement/infrastructure/repos/PrismaTaskRepo.ts

import { ICareTaskRepository } from "../../application/interfaces/ICareTaskRepository";
import { CareTask } from "../../domain/entities/CareTask";
import { PrismaClient } from "../../../../generated/prisma";
import { CareTaskMapper, CareTaskPersistenceSnapshot } from "../mappers/CareTaskMapper";
import {CareTaskDetailsDTO} from "../../application/dtos/CareTaskDetailsDto";
import { CareTaskListItemDto } from "../../application/dtos/CareTaskListItemDto";

export class PrismaCareTaskRepository implements ICareTaskRepository {

  constructor(private readonly prisma: PrismaClient) { }

  async save(careTask: CareTask): Promise<void> {
    const careTaskSnapshot: CareTaskPersistenceSnapshot = CareTaskMapper.toPersistence(careTask);
    await this.prisma.careTask.upsert({
      where: { id: careTaskSnapshot.id },
      update: {
        title: careTaskSnapshot.title,
        description: careTaskSnapshot.description,
        dueAt: careTaskSnapshot.dueTime,
        priority: careTaskSnapshot.priority,
        status: careTaskSnapshot.status,
        residentId: careTaskSnapshot.assignedToResidentId,
        assignedStaffId: careTaskSnapshot.assignedToCaregiverId,
        completionNote: careTaskSnapshot.completionNote,
      },
      create: {
        id: careTaskSnapshot.id,
        title: careTaskSnapshot.title,
        description: careTaskSnapshot.description,
        dueAt: careTaskSnapshot.dueTime,
        priority: careTaskSnapshot.priority,
        status: careTaskSnapshot.status,
        residentId: careTaskSnapshot.assignedToResidentId,
        assignedStaffId: careTaskSnapshot.assignedToCaregiverId,

      },
    });
  }



  async findById(careTaskId: string): Promise<CareTask | null> {
    const careTaskRecord = await this.prisma.careTask.findUnique({
      where: { id: careTaskId },
    });

    if (!careTaskRecord) {
      return null;
    }

    return CareTaskMapper.toDomain(careTaskRecord);
  }

  async findTodayCareTasks(params: { date: Date; }): Promise<CareTaskListItemDto[]> {
    const startOfDay = new Date(params.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const careTaskRecords = await this.prisma.careTask.findMany({
      where: {
        dueAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return careTaskRecords.map((record: any) => ({
      id: record.id,
      title: record.title,
      dueTime: record.dueAt,
      priority: record.priority,
      status: record.status,
    }));
  }

  async findTasksEligibleForOverdue(currentTime: Date): Promise<CareTask[]> {
    const records = await this.prisma.careTask.findMany({
      where: {
        dueAt:{
          lt: currentTime
        },
        status: {
          in: ["PLANNED", "ASSIGNED", "NEED_ASSISTANCE"]
        }
      },
    })

    return records.map(CareTaskMapper.toDomain);
  }

  async findTasksEligibleForMissed(): Promise<CareTask[]> {
    const records = await this.prisma.careTask.findMany({
      where: {
        status: {
          in: ["OVERDUE"]
        }
      }
    })

    return records.map(CareTaskMapper.toDomain);
  }


}