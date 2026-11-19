export const CareTaskStatuses = {
    PLANNED: 'PLANNED',
    ASSIGNED: 'ASSIGNED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    UNABLE_TO_COMPLETE: 'UNABLE_TO_COMPLETE',
    NEED_ASSISTANCE: 'NEED_ASSISTANCE',
    OVERDUE: 'OVERDUE',
    MISSED: 'MISSED',
    CANCELLED: 'CANCELLED',
} as const;

export type CareTaskStatusType = typeof CareTaskStatuses[keyof typeof CareTaskStatuses];