const CareTaskStatuses = {
    PLANNED: 'planned',
    ASSIGNED: 'assigned',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    UNABLE_TO_COMPLETE: 'unable_to_complete',
    NEED_ASSISTANCE: 'need_assistance',
    OVERDUE: 'overdue',
    MISSED: 'missed',
    CANCELLED: 'cancelled',
}

export type CareTaskStatus = typeof CareTaskStatuses[keyof typeof CareTaskStatuses];