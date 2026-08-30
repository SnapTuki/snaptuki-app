import {CareTaskNotes} from '../types/CareTaskNotes';

export type CareTaskSnapshot = Readonly<{
    id: string;
    title: string;
    description: string;
    dueTime: Date;
    priority: string;
    status: string;
    assignedToResidentId: string;
    assignedToCaregiverId?: string;
    residentId: string;
    completionNote: string | null;
    notes?: CareTaskNotes[];
}>;