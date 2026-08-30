import { CareTask } from '../../domain/entities/CareTask';
import {CareTask as PrismaCareTask} from '../../../../generated/prisma/';
export interface CareTaskPersistenceSnapshot {
    id: string;
    title: string;
    description: string;
    dueTime: Date;
    priority: string;
    status: string;
    assignedToResidentId: string;
    assignedToCaregiverId?: string;
    residentId: string;
    completionNote: string | null;
}


export class CareTaskMapper {

    public static toPersistence(entity: CareTask): CareTaskPersistenceSnapshot {
        const snapshot = entity.getSnapshot();

        return {
            id: snapshot.id,
            title: snapshot.title,
            description: snapshot.description,
            dueTime: snapshot.dueTime,
            priority: snapshot.priority,
            status: snapshot.status,
            assignedToResidentId: snapshot.assignedToResidentId,
            assignedToCaregiverId: snapshot.assignedToCaregiverId,
            residentId: snapshot.residentId,
            completionNote: snapshot.completionNote ? snapshot.completionNote : null,
        }
    }


    public static toDomain(raw: PrismaCareTask): CareTask {
        const snapshot: CareTaskPersistenceSnapshot = {
            id: raw.id,
            title: raw.title,
            description: raw.description,
            dueTime: raw.dueAt,
            priority: raw.priority,
            status: raw.status,
            assignedToResidentId: raw.residentId,
            assignedToCaregiverId: raw.assignedStaffId ? raw.assignedStaffId : undefined,
            residentId: raw.residentId,
            completionNote: raw.completionNote ? raw.completionNote : null,
        };

        return CareTask.rehydrate(snapshot);
    }
}