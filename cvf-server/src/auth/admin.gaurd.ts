import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('Cookies:', request.cookies);
    console.log('User in AdminGuard:', request.user);

    if (!request.user) {
      throw new ForbiddenException('User is not authenticated.');
    }
    if (request.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied: Admins only.');
    }
    return true;
  }
}
