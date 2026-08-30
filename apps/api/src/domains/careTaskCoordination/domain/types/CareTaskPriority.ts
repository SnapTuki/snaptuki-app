export const CareTaskPriorities = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    CRITICAL: 'critical',
} as const;

export type CareTaskPriority = typeof CareTaskPriorities[keyof typeof CareTaskPriorities];