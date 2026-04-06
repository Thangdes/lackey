import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {
        this.logger.setContext('HttpExceptionFilter');
    }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const requestId: string | undefined = (request as any)?.requestId;
        if (requestId) {
            try {
                response?.setHeader?.('X-Request-Id', requestId);
            } catch { }
        }

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : 'Internal server error';

        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : null;

        // Get error details
        let errorDetails: any = message;
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            errorDetails = exceptionResponse;
        }

        // Log the error
        this.logger.error(
            `HTTP ${status} Error - ${request.method} ${request.url}`,
            exception.stack,
            'HttpException',
        );

        // Hide sensitive error details in production
        const isDevelopment = process.env.NODE_ENV === 'development';

        const errorResponse: any = {
            success: false,
            statusCode: status,
            requestId,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: this.getErrorMessage(errorDetails),
        };

        // Include stack trace and details only in development
        if (isDevelopment) {
            errorResponse.error = errorDetails;
            if (exception.stack) {
                errorResponse.stack = exception.stack;
            }
        }

        response.status(status).json(errorResponse);
    }

    private getErrorMessage(error: any): string | string[] {
        if (typeof error === 'string') {
            return error;
        }

        if (error.message) {
            return error.message;
        }

        if (Array.isArray(error)) {
            return error;
        }

        return 'An error occurred';
    }
}
