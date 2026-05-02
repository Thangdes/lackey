import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';

export const CurrentSupplierId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated.');
    }

    if (user.role === UserRole.ADMIN) {
      // Admin sees everything
      return null;
    }

    if (!user.supplierId) {
      throw new ForbiddenException('You are not associated with any supplier account.');
    }

    return user.supplierId;
  },
);
