export type CareTaskPriorityDto = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
export type CareTaskStatusDto = "PLANNED" | "ASSIGNED" | "COMPLETED" | "UNABLE_TO_COMPLETE" | "NEED_ASSISTANCE" | "OVERDUE" | "MISSED" | "CANCELLED";
export interface CareTaskDetailsDTO {
    id: string;
    title: string;
    description: string;
    dueTime: Date;
    priority: CareTaskPriorityDto;
    status: CareTaskStatusDto;
    completionNote: string | null;
    assignedToCaregiver: AssignedToCaregiver | null;
    assignedToResident: AssignedToResident | null;
}

interface AssignedToCaregiver {
    id: string;
    firstName: string;
    lastName: string;
}

interface AssignedToResident {
    residentId: string;
    firstName: string;
    lastName: string;
}
