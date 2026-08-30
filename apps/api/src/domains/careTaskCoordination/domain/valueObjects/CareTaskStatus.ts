import {CareTaskStatus as CareTaskStatusType} from '../types/CareTaskStatus';

export class CareTaskStatus {
    private constructor(private readonly _status: CareTaskStatusType) {}

    public static create(status: CareTaskStatusType): CareTaskStatus {
        CareTaskStatus.validateStatus(status);
        return new CareTaskStatus(status);
    }

    private static validateStatus(status: CareTaskStatusType): void {
        // Implement your validation logic here
        const validStatuses = [
            'planned',
            'assigned',
            'in_progress',
            'completed',
            'unable_to_complete',
            'need_assistance',
            'overdue',
            'missed',
            'cancelled'
        ];

        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid status: ${status}`);
        }
    }

    public getStatus(): CareTaskStatusType {
        return this._status;
    }
}