import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { Request, Response, NextFunction } from 'express';

class CustomLogger extends ConsoleLogger {
  log(message: string, context?: string) {
    super.log(`[LOG] ${message}`, context || 'App');
  }

  error(message: string, trace?: string, context?: string) {
    super.error(`[ERROR] ${message}`, trace, context || 'App');
  }

  warn(message: string, context?: string) {
    super.warn(`[WARN] ${message}`, context || 'App');
  }

  debug(message: string, context?: string) {
    super.debug(`[DEBUG] ${message}`, context || 'App');
  }

  verbose(message: string, context?: string) {
    super.verbose(`[VERBOSE] ${message}`, context || 'App');
  }
}

async function bootstrap() {
  const logger = new CustomLogger();

  const app = await NestFactory.create(AppModule, {
    logger, // dùng custom logger
  });

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:80',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://0.0.0.0:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://0.0.0.0:5173',
      'https://localhost:3000',
      'http://nginx',
      'http://client:3000',
      'http://client',
      'http://client:80',
      '*'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Cookie',
    ],
    credentials: true,
  });

  // Middleware log HTTP
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
        'HTTP',
      );
    });
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());
  app.use(passport.initialize());

  const port = 8000;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
