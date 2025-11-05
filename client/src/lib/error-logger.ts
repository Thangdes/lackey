type ErrorLevel = 'error' | 'warning' | 'info';

interface LoggedError {
  message: string;
  level: ErrorLevel;
  timestamp: string;
  userAgent?: string;
  url?: string;
  stack?: string;
  context?: Record<string, unknown>;
}

class ErrorLogger {
  private maxLogs = 100;
  private logs: LoggedError[] = [];
  private isProduction = process.env.NODE_ENV === 'production';

  log(error: Error | string, level: ErrorLevel = 'error', context?: Record<string, unknown>) {
    const logEntry: LoggedError = {
      message: error instanceof Error ? error.message : error,
      level,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      stack: error instanceof Error ? error.stack : undefined,
      context,
    };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (!this.isProduction) {
      console.error('[ErrorLogger]', logEntry);
    }

    this.sendToMonitoring(logEntry);
  }

  error(error: Error | string, context?: Record<string, unknown>) {
    this.log(error, 'error', context);
  }

  warning(message: string, context?: Record<string, unknown>) {
    this.log(message, 'warning', context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log(message, 'info', context);
  }

  getLogs(): LoggedError[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  private async sendToMonitoring(logEntry: LoggedError) {
    if (!this.isProduction) return;

    try {
      await fetch('/api/v1/logs/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      console.error('Failed to send error log:', error);
    }
  }

  captureException(error: Error, context?: Record<string, unknown>) {
    this.error(error, context);
  }
}

export const errorLogger = new ErrorLogger();

export function withErrorLogging<T extends (...args: unknown[]) => unknown>(
  fn: T,
  context?: Record<string, unknown>
): T {
  return ((...args: unknown[]) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch((error) => {
          errorLogger.error(error, { ...context, functionName: fn.name });
          throw error;
        });
      }
      return result;
    } catch (error) {
      errorLogger.error(error as Error, { ...context, functionName: fn.name });
      throw error;
    }
  }) as T;
}
