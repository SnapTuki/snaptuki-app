import {CareTaskPriority as CareTaskPriorityType} from "../types/CareTaskPriority";
import {CareTaskPriorities} from "../types/CareTaskPriority";

export class CareTaskPriority {
    private constructor(private readonly _priority: string) {}

    public static create(priority: string): CareTaskPriority {
        CareTaskPriority.validatePriority(priority);
        return new CareTaskPriority(priority);
    }

    private static validatePriority(priority: string): void {
        // Implement your validation logic here
        const validPriorities: string[] = [CareTaskPriorities.LOW, CareTaskPriorities.NORMAL, CareTaskPriorities.HIGH, CareTaskPriorities.CRITICAL];
        if (!validPriorities.includes(priority)) {
            throw new Error(`Invalid priority value: ${priority}`);
        }
    }

    public getPriority(): string {
        return this._priority;
    }
}