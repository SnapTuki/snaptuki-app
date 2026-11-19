export class DueTime {
    private constructor(private readonly _dueTime: Date) {}

    public static create(dueTime: Date): DueTime {
        DueTime.validateDueTime(dueTime);
        return new DueTime(dueTime);
    }

    private static validateDueTime(dueTime: Date): void {
        // Implement your validation logic here
        if (dueTime.getTime() < Date.now()) {
            throw new Error("Due time cannot be in the past");
        }
    }

    public getDueTime(): Date {
        return this._dueTime;
    }
}