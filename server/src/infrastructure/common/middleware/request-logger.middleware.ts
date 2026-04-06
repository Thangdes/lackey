import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../logger/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    constructor(private readonly logger: LoggerService) {
        this.logger.setContext('RequestLogger');
    }

    use(req: Request, res: Response, next: NextFunction) {
        const incoming = req.get('x-request-id');
        const requestId = (incoming && String(incoming).trim()) ? String(incoming).trim() : uuidv4();
        req['requestId'] = requestId;
        res.setHeader('X-Request-Id', requestId);

        const { method, originalUrl, ip } = req;
        const userAgent = req.get('user-agent') || '';
        const startTime = Date.now();

        this.logger.log(
            `[${requestId}] ${method} ${originalUrl} - IP: ${ip}`,
            'Request',
        );

        this.logger.debug(
            `[${requestId}] User-Agent: ${userAgent}`,
            'Request',
        );

        res.on('finish', () => {
            const duration = Date.now() - startTime;
            const { statusCode } = res;
            const logLevel = statusCode >= 400 ? 'warn' : 'log';

            this.logger[logLevel](
                `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
                'Response',
            );
        });

        next();
    }
}
