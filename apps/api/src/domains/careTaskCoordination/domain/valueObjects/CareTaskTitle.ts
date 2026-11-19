export class CareTaskTitle {
    private constructor(private readonly _title: string) {}

   public static create(title: string): CareTaskTitle {
        CareTaskTitle.validateTitle(title);
        return new CareTaskTitle(title);
    }

    private static validateTitle(title: string): void {
        // Implement your validation logic here
        if(title.length === 0) {
            throw new Error("Title cannot be empty");
        }
        if(title.length > 100) {
            throw new Error("Title cannot exceed 100 characters");
        }
    }

    public getTitle(): string {
        return this._title;
    }
}