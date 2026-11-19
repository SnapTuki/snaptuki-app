export const CareTaskPriorities = {
    LOW: 'LOW',
    NORMAL: 'NORMAL',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
} as const;

export type CareTaskPriorityType = typeof CareTaskPriorities[keyof typeof CareTaskPriorities];