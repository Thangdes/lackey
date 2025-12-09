import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { join } from 'path';

@Injectable()
export class LoggerService implements NestLoggerService {
    private logger: winston.Logger;
    private context?: string;

    constructor(context?: string) {
        this.context = context;
        this.logger = this.createLogger();
    }

    private createLogger(): winston.Logger {
        const logDir = join(process.cwd(), 'logs');
        const env = process.env.NODE_ENV || 'development';
        const isDevelopment = env === 'development';

        // Custom format for console output with colors
        const consoleFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize({ all: true }),
            winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                const ctx = context || this.context || 'Application';
                const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
                return `${timestamp} [${ctx}] ${level}: ${message} ${metaStr}`;
            }),
        );

        // Format for file output (no colors)
        const fileFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.uncolorize(),
            winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                const ctx = context || this.context || 'Application';
                const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
                return `${timestamp} [${ctx}] ${level}: ${message} ${metaStr}`;
            }),
        );

        // Transport: Console
        const consoleTransport = new winston.transports.Console({
            format: consoleFormat,
            level: isDevelopment ? 'debug' : 'info',
        });

        // Transport: Error file (daily rotate)
        const errorFileTransport = new DailyRotateFile({
            filename: join(logDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            format: fileFormat,
            maxFiles: '30d', // Keep logs for 30 days
            maxSize: '20m', // Max file size 20MB
        });

        // Transport: Combined file (daily rotate)
        const combinedFileTransport = new DailyRotateFile({
            filename: join(logDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            format: fileFormat,
            maxFiles: '30d',
            maxSize: '20m',
        });

        return winston.createLogger({
            level: isDevelopment ? 'debug' : 'info',
            transports: [
                consoleTransport,
                errorFileTransport,
                combinedFileTransport,
            ],
            exceptionHandlers: [
                new DailyRotateFile({
                    filename: join(logDir, 'exceptions-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '30d',
                    maxSize: '20m',
                }),
            ],
            rejectionHandlers: [
                new DailyRotateFile({
                    filename: join(logDir, 'rejections-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '30d',
                    maxSize: '20m',
                }),
            ],
        });
    }

    setContext(context: string) {
        this.context = context;
    }

    log(message: any, context?: string) {
        this.logger.info(message, { context: context || this.context });
    }

    error(message: any, trace?: string, context?: string) {
        this.logger.error(message, {
            context: context || this.context,
            trace,
        });
    }

    warn(message: any, context?: string) {
        this.logger.warn(message, { context: context || this.context });
    }

    debug(message: any, context?: string) {
        this.logger.debug(message, { context: context || this.context });
    }

    verbose(message: any, context?: string) {
        this.logger.verbose(message, { context: context || this.context });
    }

    // Additional helper methods
    http(message: string, meta?: any) {
        this.logger.http(message, { context: this.context, ...meta });
    }

    logRequest(method: string, url: string, statusCode: number, duration: number) {
        this.logger.http(`${method} ${url} ${statusCode} - ${duration}ms`, {
            context: 'HTTP',
            method,
            url,
            statusCode,
            duration,
        });
    }
}
