import { CareTaskTitle } from '../valueObjects/CareTaskTitle';
import { CareTaskDescription } from '../valueObjects/CareTaskDescription';
import { CareTaskPriority } from '../valueObjects/CareTaskPriority';
import { CareTaskStatus } from '../valueObjects/CareTaskStatus';
import { DueTime } from '../valueObjects/DueTime';
import { CareTaskNotes } from '../types/CareTaskNotes';
import { CareTaskSnapshot } from '../types/CareTaskSnapshot';

export class CareTask {

    private _completionNote: string | null = null;
    private _careTaskNotes: CareTaskNotes[] = [];
    private constructor(
        private _id: string,
        private _title: CareTaskTitle,
        private _priority: CareTaskPriority,
        private _status: CareTaskStatus,
        private _dueTime: DueTime,
        private _assignedResidentId: string,
        private _description?: CareTaskDescription,
        private _assignedCaregiverId?: string,

    ) { }

    public static create(
        title: CareTaskTitle,
        description: CareTaskDescription,
        priority: CareTaskPriority,
        status: CareTaskStatus,
        dueTime: DueTime,
        assignedCaregiverId: string,
        assignedResidentId: string,
    ): CareTask {
        return new CareTask(crypto.randomUUID(), title, priority, status, dueTime, assignedResidentId, description, assignedCaregiverId);
    }

    public cancelCareTask(): void {
        if (this._status.getStatus() === 'completed' || this._status.getStatus() === 'cancelled') {
            throw new Error("Cannot cancel a care task that is already completed or cancelled");
        }
        this._status = CareTaskStatus.create('cancelled');
    }


    public completeCareTask(completionNote?: string): void {
        if (this._status.getStatus() === 'completed' || this._status.getStatus() === 'cancelled') {
            throw new Error("Cannot complete a care task that is already completed or cancelled");
        }
        this._status = CareTaskStatus.create('completed');
        if(completionNote)
            this._completionNote = completionNote;
    }

    public updateCareTaskDetails(
        title: CareTaskTitle,
        description: CareTaskDescription,
        assignedCaregiverId?: string,
    ): void {
        if (this._status.getStatus() === 'completed' || this._status.getStatus() === 'cancelled') {
            throw new Error("Cannot update a care task that is already completed or cancelled");
        }
        if (title) this._title = title;
        if (description) this._description = description;
        if (assignedCaregiverId) this._assignedCaregiverId = assignedCaregiverId;
    }

    public addCareTaskNote(note: CareTaskNotes): void {
        if (this._status.getStatus() === 'completed' || this._status.getStatus() === 'cancelled') {
            throw new Error("Cannot add a note to a care task that is already completed or cancelled");
        }
        if (!this._careTaskNotes) {
            this._careTaskNotes = [];
        }
        this._careTaskNotes.push(note);
    }

    public getId(): string {
        return this._id;
    }

    public markAsOverdue(currentTime: Date): void {
        if (this._status.getStatus() === 'completed' || this._status.getStatus() === 'cancelled') {
            throw new Error("Cannot mark a care task as overdue that is already completed or cancelled");
        }

        if (currentTime.getTime() <= this._dueTime.getDueTime().getTime()) {
            throw new Error(
                "Cannot mark a CareTask as overdue before its due time!"
            )
        }
        this._status = CareTaskStatus.create('overdue');
    }

    public markAsMissed(): void {
        if (this._status.getStatus() === 'completed' || this._status.getStatus() === 'cancelled') {
            throw new Error("Cannot mark a care task as missed that is already completed or cancelled");
        }
        this._status = CareTaskStatus.create('missed');
    }


    public getSnapshot(): CareTaskSnapshot {
        return {
            id: this._id,
            title: this._title.getTitle(),
            description: this._description ? this._description.getDescription() : '',
            dueTime: this._dueTime.getDueTime(),
            priority: this._priority.getPriority(),
            status: this._status.getStatus(),
            assignedToResidentId: this._assignedResidentId,
            assignedToCaregiverId: this._assignedCaregiverId,
            residentId: this._assignedResidentId,
            completionNote: this._completionNote,
            notes: this._careTaskNotes
        };
    }

    public static rehydrate(snapshot: CareTaskSnapshot): CareTask {
        const careTask = new CareTask(
            snapshot.id,
            CareTaskTitle.create(snapshot.title),
            CareTaskPriority.create(snapshot.priority),
            CareTaskStatus.create(snapshot.status),
            DueTime.create(snapshot.dueTime),
            snapshot.assignedToResidentId,
            CareTaskDescription.create(snapshot.description),
            snapshot.assignedToCaregiverId
        );

        if (snapshot.completionNote) {
            careTask._completionNote = snapshot.completionNote;
        }

        if (snapshot.notes) {
            careTask._careTaskNotes = snapshot.notes;
        }

        return careTask;
    }

    public assignToCaregiver(caregiverId: string): void {
        if (this._status.getStatus() === 'completed' || this._status.getStatus() === 'cancelled') {
            throw new Error("Canceled or Completed care task cannot be assigned");
        }

        this._assignedCaregiverId = caregiverId;
    }

    public changePriority(input: {newPriority: CareTaskPriority }): void {
        if (this._status.getStatus() === 'completed' || this._status.getStatus() === 'cancelled') {
            throw new Error("Canceled or Completed care task cannot be prioritized");
        }

        this._priority = input.newPriority;
    }

    public rescheduel(input: {newScheduel: DueTime }): void {
        if (this._status.getStatus() === 'completed' || this._status.getStatus() === 'cancelled') {
            throw new Error("Canceled or Completed care task cannot be prioritized");
        }

        if(input.newScheduel.getDueTime().getTime() <= this._dueTime.getDueTime().getTime()) {
            throw new Error("New due time must be in the future");
        }

        this._dueTime = input.newScheduel;
    }



}