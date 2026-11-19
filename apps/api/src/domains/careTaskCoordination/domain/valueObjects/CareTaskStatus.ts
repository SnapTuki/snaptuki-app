import { CareTaskStatusType, CareTaskStatuses} from '../types/CareTaskStatus';

export class CareTaskStatus {
    private constructor(private readonly _status: string) {}

    public static create(status: string): CareTaskStatus {
        CareTaskStatus.validateStatus(status);
        return new CareTaskStatus(status);
    }

    private static validateStatus(status: string): void {
        // Implement your validation logic here
        const validStatus = Object.values(CareTaskStatuses);

        if (!validStatus.includes(status as CareTaskStatusType)) {
            throw new Error(`Invalid status: ${status}`);
        }
    }

    public getStatus(): string {
        return this._status;
    }
}