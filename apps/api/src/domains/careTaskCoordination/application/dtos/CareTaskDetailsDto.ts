export type CareTaskPriorityDto = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
export type CareTaskStatusDto = "PLANNED" | "ASSIGNED" | "COMPLETED" | "UNABLE_TO_COMPLETE" | "NEED_ASSISTANCE" | "OVERDUE" | "MISSED" | "CANCELLED";
export interface CareTaskDetailsDTO {
    id: string;
    title: string;
    description: string;
    dueTime: Date;
    priority: CareTaskPriorityDto;
    status: CareTaskStatusDto;
    assignedToResidentId: string;
    assignedToCaregiverId: string | null;
    completionNote: string | null;
}
