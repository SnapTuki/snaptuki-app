export class CareTaskDescription {
    private constructor(private readonly _description: string) {}
    
    public static create(description: string): CareTaskDescription {
        CareTaskDescription.validateDescription(description);
        return new CareTaskDescription(description);
    }

    private static validateDescription(description: string): void {
        // Implement your validation logic here
    }

    public getDescription(): string {
        return this._description;
    }
}

