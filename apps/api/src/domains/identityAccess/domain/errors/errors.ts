export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DomainError';
    }
}

export class EmailAlreadyRegistered extends DomainError {
    constructor() {
        super('Email is already in use');
    }
}


export class UserNotFound extends DomainError {
    constructor() {
        super('User not found');
    }
}
export class InvalidCredentials extends DomainError {
    constructor() {
        super('Invalid email or password');
    }
}
export class UserInactive extends DomainError {
    constructor() {
        super('User is inactive');
    }
}
export class RoleAlreadyAssigned extends DomainError {
    constructor() {
        super('Role already assigned to user');
    }
}
export class RoleNotAssigned extends DomainError {
    constructor() {
        super('Role not assigned to user');
    }
}
