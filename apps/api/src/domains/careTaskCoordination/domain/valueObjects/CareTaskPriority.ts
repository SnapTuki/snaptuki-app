import {CareTaskPriorityType, CareTaskPriorities} from "../types/CareTaskPriority";

export class CareTaskPriority {
    private constructor(private readonly _priority: string) {}

    public static create(priority: string): CareTaskPriority {
        CareTaskPriority.validatePriority(priority);
        return new CareTaskPriority(priority);
    }

    private static validatePriority(priority: string): void {
        // Implement your validation logic here
        const validPriorities = Object.values(CareTaskPriorities);

        if (!validPriorities.includes(priority as CareTaskPriorityType)) {
            throw new Error(`Invalid priority value: ${priority}`);
        }
    }

    public getPriority(): string {
        return this._priority;
    }
}