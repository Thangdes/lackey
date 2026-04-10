import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtService({ secret: process.env.JWT_SECRET });

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.cookies?.accessToken;

    if (!token) {
      return null;
    }

    try {
      const payload = jwtService.verify(token);
      return { id: payload.sub, ...payload };
    } catch {
      return null;
    }
  },
);
