import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
  Patch,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/** Compute cookie options based on environment to avoid repetition. */
function buildCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const, // client & server share parent domain (e.g. api.domain.com / domain.com)
    path: '/',
  };
}

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signup(body);
    this.setAuthCookies(res, tokens);
    return { message: 'Signup successful' };
  }

  @Post('login')
  async login(
    @Body() loginData: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Prefer guestCartId from httpOnly cookie over body field (more secure)
    const guestCartIdFromCookie = req.cookies?.guestCartId as
      | string
      | undefined;
    if (guestCartIdFromCookie) {
      loginData.guestCartId = guestCartIdFromCookie;
    }

    const tokens = await this.authService.login(loginData);
    this.setAuthCookies(res, tokens);

    // Clear the guest cart cookie after merging
    if (guestCartIdFromCookie) {
      const isProduction = process.env.NODE_ENV === 'production';
      res.clearCookie('guestCartId', buildCookieOptions(isProduction));
    }

    return { message: 'Login successful' };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return req.user;
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @Req() req,
    @Body() body: { fullName?: string; phone?: string },
  ) {
    return this.authService.updateProfile(req.user.id, body);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = buildCookieOptions(isProduction);

    if (!refreshToken) {
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      res.clearCookie('hasAuth', { ...cookieOptions, httpOnly: false });
      res.status(401);
      return { message: 'No refresh token' };
    }

    try {
      const tokens = await this.authService.refreshToken(refreshToken);
      this.setAuthCookies(res, tokens);
      return { message: 'Token refreshed' };
    } catch {
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      res.clearCookie('hasAuth', { ...cookieOptions, httpOnly: false });
      res.status(401);
      return { message: 'Invalid refresh token' };
    }
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Revoke the refresh token in DB so it cannot be reused
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = buildCookieOptions(isProduction);
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('hasAuth', { ...cookieOptions, httpOnly: false });

    return { message: 'Logged out successfully' };
  }

  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const base = buildCookieOptions(isProduction);

    res.cookie('accessToken', tokens.accessToken, {
      ...base,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...base,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Non-HttpOnly flag so the client can cheaply detect auth state
    res.cookie('hasAuth', '1', {
      ...base,
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}