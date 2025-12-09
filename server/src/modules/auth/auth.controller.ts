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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: { username: string; email: string; password: string },
    @Res() res: Response,
  ) {
    const tokens = await this.authService.signup(body);
    this.setAuthCookies(res, tokens);
    return res.send({ message: 'Signup successful' });
  }

  @Post('login')
  async login(
    @Body() loginData: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const guestCartId = req.cookies.guestCartId;
    const tokens = await this.authService.login(loginData);
    this.setAuthCookies(res, tokens);
    if (guestCartId) {
      const originHeader = (req.headers?.origin as string | undefined) || '';
      const hostToTest = originHeader || `http://${req.hostname || ''}`;
      const isLocalhost = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(hostToTest);
      res.clearCookie('guestCartId', {
        httpOnly: true,
        secure: isLocalhost ? false : true,
        sameSite: isLocalhost ? 'lax' : 'none',
        path: '/',
      });
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
    const updated = await this.authService.updateProfile(req.user.id, body);
    return updated;
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'lax' as const,
      path: '/',
    };

    if (!refreshToken) {
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      // Also clear the public hasAuth flag
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
      // Also clear the public hasAuth flag
      res.clearCookie('hasAuth', { ...cookieOptions, httpOnly: false });
      res.status(401);
      return { message: 'Invalid refresh token' };
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'lax' as const,
      path: '/',
    };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    // Clear the public hasAuth flag
    res.clearCookie('hasAuth', { ...cookieOptions, httpOnly: false });
    return { message: 'Logged out successfully' };
  }

  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction;

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Set a non-HttpOnly flag so the client can detect auth state cheaply
    res.cookie('hasAuth', '1', {
      httpOnly: false,
      secure: secureFlag,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}