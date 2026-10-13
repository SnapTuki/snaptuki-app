export interface CareTaskListItemDto {
    id: string;
    title: string;
    priority: string;
    dueTime: Date;
    status: string;
    assignedToCaregiver: AssignedToCaregiver | null;
    assignedToResident: AssignedToResident | null;
}

interface AssignedToCaregiver {
    id: string;
    firstName: string;
    lastName: string;
}

interface AssignedToResident {
    residentId: string;
    firstName: string;
    lastName: string;
}



