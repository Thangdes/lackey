import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {
        this.logger.setContext('HttpLoggingInterceptor');
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, originalUrl, body, query, params, ip, headers } = request;
        const userAgent = headers['user-agent'] || '';

        const startTime = Date.now();

        // Log request
        this.logger.log(
            `Incoming Request: ${method} ${originalUrl}`,
            'HTTP',
        );

        // Log request details in debug mode
        this.logger.debug(
            `Request Details - IP: ${ip}, User-Agent: ${userAgent}`,
            'HTTP',
        );

        // Log body (exclude sensitive fields)
        if (body && Object.keys(body).length > 0) {
            const sanitizedBody = this.sanitizeData(body);
            this.logger.debug(
                `Request Body: ${JSON.stringify(sanitizedBody)}`,
                'HTTP',
            );
        }

        if (query && Object.keys(query).length > 0) {
            this.logger.debug(
                `Query Params: ${JSON.stringify(query)}`,
                'HTTP',
            );
        }

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const duration = Date.now() - startTime;
                    const statusCode = response.statusCode;

                    this.logger.log(
                        `Outgoing Response: ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
                        'HTTP',
                    );

                    // Log response data in debug mode (truncate if too long)
                    if (data) {
                        const responseStr = JSON.stringify(data);
                        const truncated = responseStr.length > 1000
                            ? responseStr.substring(0, 1000) + '...'
                            : responseStr;
                        this.logger.debug(
                            `Response Data: ${truncated}`,
                            'HTTP',
                        );
                    }
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    const statusCode = error.status || 500;

                    this.logger.error(
                        `Error Response: ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
                        error.stack,
                        'HTTP',
                    );
                },
            }),
        );
    }

    /**
     * Remove sensitive fields from logging
     */
    private sanitizeData(data: any): any {
        const sensitiveFields = [
            'password',
            'token',
            'accessToken',
            'refreshToken',
            'secret',
            'apiKey',
            'authorization',
        ];

        if (typeof data !== 'object' || data === null) {
            return data;
        }

        const sanitized = { ...data };

        for (const key in sanitized) {
            if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                sanitized[key] = '***REDACTED***';
            } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
                sanitized[key] = this.sanitizeData(sanitized[key]);
            }
        }

        return sanitized;
    }
}
