/**
 * Base error for all domain-specific exceptions.
 */

export class DomainError extends Error{
    constructor(message: string, public code: string){
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    };
};

export class OtpCodeError extends DomainError {
    constructor(message: string = 'Otp code has been expired'){
        super(message, 'OTP_CODE_ERROR');
    };
};

export class InvalidCredentialsError extends DomainError {
    constructor(messaage: string){
        super(messaage, 'INVALID_CREDENTIALS');
    };
};



