// src/domains/taskManagement/infrastructure/repos/PrismaTaskRepo.ts

import { ICareTaskRepository } from "../../application/interfaces/ICareTaskRepository";
import { CareTask } from "../../domain/entities/CareTask";
import { PrismaClient } from "../../../../generated/prisma";
import { CareTaskMapper, CareTaskPersistenceSnapshot } from "../mappers/CareTaskMapper";
import {CareTaskDetailsDTO, CareTaskPriorityDto, CareTaskStatusDto} from "../../application/dtos/CareTaskDetailsDto";
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
      include: {
        assignedStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        resident: {
          select: {
            residentId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return careTaskRecords.map((record: any) => ({
      id: record.id,
      title: record.title,
      dueTime: record.dueAt,
      priority: record.priority,
      status: record.status,
      assignedToCaregiver: record.assignedStaff ? {
        id: record.assignedStaff.id,
        firstName: record.assignedStaff.firstName,
        lastName: record.assignedStaff.lastName
      } : null,
      assignedToResident: record.resident ? {
        residentId: record.resident.id,
        firstName: record.resident.firstName,
        lastName: record.resident.lastName
      } : null
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

  async findCareTaskDetailsById(careTaskId: string): Promise<CareTaskDetailsDTO | null> {
    const careTaskRecord = await this.prisma.careTask.findUnique({
      where: { id: careTaskId },
      include: {
        assignedStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        resident: {
          select: {
            residentId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!careTaskRecord) {
      return null;
    }

    return {
      id: careTaskRecord.id,
      title: careTaskRecord.title,
      description: careTaskRecord.description,
      priority: careTaskRecord.priority as CareTaskPriorityDto,
      status: careTaskRecord.status as CareTaskStatusDto,
      dueTime: careTaskRecord.dueAt,
      assignedToCaregiver: careTaskRecord.assignedStaff ? {
        id: careTaskRecord.assignedStaff.id,
        firstName: careTaskRecord.assignedStaff.firstName,
        lastName: careTaskRecord.assignedStaff.lastName
      } : null,
      assignedToResident: careTaskRecord.resident ? {
        residentId: careTaskRecord.resident.residentId,
        firstName: careTaskRecord.resident.firstName,
        lastName: careTaskRecord.resident.lastName
      } : null,

      completionNote: careTaskRecord.completionNote
    };
  }


}