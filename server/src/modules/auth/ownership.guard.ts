import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '@/infrastructure/database/prisma.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required.');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const params = request.params;
    const customerIdFromParams = params.customerId;

    if (!customerIdFromParams) {
      return true;
    }

    const loggedInUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { customerId: true },
    });

    if (!loggedInUser) {
      throw new ForbiddenException('User data not found.');
    }

    const loggedInUserCustomerId = loggedInUser.customerId;

    if (loggedInUserCustomerId === customerIdFromParams) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource.',
    );
  }
}
