import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseFormDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    if (body && body.variants && typeof body.variants === 'string') {
      try {
        body.variants = JSON.parse(body.variants);
      } catch {
        throw new BadRequestException(
          'Invalid JSON format for variants field.',
        );
      }
    }

    if (body && body.variants && Array.isArray(body.variants)) {
      body.variants = body.variants.map((variant) => ({
        ...variant,
        price: Number(variant.price),
        stockQuantity: Number(variant.stockQuantity),
      }));
    }

    return next.handle();
  }
}
