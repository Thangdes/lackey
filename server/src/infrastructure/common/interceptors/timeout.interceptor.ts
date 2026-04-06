import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    private readonly timeoutValue: number;

    constructor(timeoutValue: number = 30000) {
        this.timeoutValue = timeoutValue; // Default 30 seconds
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(this.timeoutValue),
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    return throwError(
                        () => new RequestTimeoutException('Request timeout exceeded'),
                    );
                }
                return throwError(() => err);
            }),
        );
    }
}
