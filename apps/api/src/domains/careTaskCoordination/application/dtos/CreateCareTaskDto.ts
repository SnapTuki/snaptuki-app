export interface NewCareTaskInput {
    title: string;
    description: string;
    dueTime: string;
    priority: string;
    status: string;
    assignedToResidentId: string;
    assignedToCaregiverId?: string;
    residentId: string;
}

