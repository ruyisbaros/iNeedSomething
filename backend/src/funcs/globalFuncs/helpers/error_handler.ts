import httpStatusCodes from "http-status-codes"

export interface IErrorResponse {
    message: string;
    statusCode: number;
    status: string;
    serializeError(): IError;
}

export interface IError {
    message: string;
    statusCode: number;
    status: string;
}

export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract status: string;

    constructor(message: string) {
        super(message)
    }

    serializeError(): IError {
        return {
            message: this.message,
            status: this.status,
            statusCode: this.statusCode
        }
    }
}

export class BadRequestError extends CustomError {
    statusCode = httpStatusCodes.BAD_REQUEST;
    status = 'error'
    constructor(message: string) {
        super(message)
    }
}

export class NotFoundError extends CustomError {
    statusCode = httpStatusCodes.NOT_FOUND;
    status = 'error'
    constructor(message: string) {
        super(message)
    }
}

export class NotAuthorizedError extends CustomError {
    statusCode = httpStatusCodes.UNAUTHORIZED;
    status = 'error'
    constructor(message: string) {
        super(message)
    }
}

export class WrongCredentialsError extends CustomError {
    statusCode = httpStatusCodes.BAD_REQUEST;
    status = 'error'
    constructor(message: string) {
        super(message)
    }
}

export class UserAlreadyExistError extends CustomError {
    statusCode = httpStatusCodes.BAD_REQUEST;
    status = 'error'
    constructor(message: string) {
        super(message)
    }
}

export class FileToLargeError extends CustomError {
    statusCode = httpStatusCodes.REQUEST_TOO_LONG;
    status = 'error'
    constructor(message: string) {
        super(message)
    }
}

export class ServerError extends CustomError {
    statusCode = httpStatusCodes.SERVICE_UNAVAILABLE;
    status = 'error'
    constructor(message: string) {
        super(message)
    }
}

export class JoiRequestValidationError extends CustomError {
    statusCode = httpStatusCodes.BAD_REQUEST;
    status = 'error'
    constructor(message: string) {
        super(message)
    }
}