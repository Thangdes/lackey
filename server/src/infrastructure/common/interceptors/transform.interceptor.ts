import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    success: boolean;
    data: T;
    requestId?: string;
    message?: string;
    timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        const http = context.switchToHttp();
        const req = http.getRequest();
        const res = http.getResponse();
        const requestId: string | undefined = req?.requestId;
        if (requestId) {
            try {
                res?.setHeader?.('X-Request-Id', requestId);
            } catch { }
        }

        return next.handle().pipe(
            map((data) => {
                // If data already has the response structure, return as-is
                if (data && typeof data === 'object' && 'success' in data) {
                    return data;
                }

                // Transform raw response to standard format
                return {
                    success: true,
                    data,
                    requestId,
                    message: data?.message || 'Success',
                    timestamp: new Date().toISOString(),
                };
            }),
        );
    }
}
