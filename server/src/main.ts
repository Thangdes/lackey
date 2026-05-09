import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { LoggerService } from './infrastructure/common/logger/logger.service';
import { HttpLoggingInterceptor } from './infrastructure/common/interceptors/http-logging.interceptor';
import { TransformInterceptor } from './infrastructure/common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './infrastructure/common/interceptors/timeout.interceptor';
import { HttpExceptionFilter } from './infrastructure/common/filters/http-exception.filter';
import { RequestLoggerMiddleware } from './infrastructure/common/middleware/request-logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create app with logger
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Get logger service from DI container
  const logger = app.get(LoggerService);
  logger.setContext('Bootstrap');
  app.useLogger(logger);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS configuration
  const corsOrigins = [
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
    'https://lackey.click',
  ];
  app.enableCors({
    origin: process.env.NODE_ENV === 'development' ? true : corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Cookie',
    ],
    credentials: true,
  });

  // Global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors.map(error => {
          const constraints = error.constraints 
            ? Object.values(error.constraints).join(', ')
            : 'validation failed';
          return `${error.property}: ${constraints}`;
        });
        return new BadRequestException({
          message: 'Validation failed',
          errors: messages,
        });
      },
    }),
  );

  // Global interceptors
  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(logger),
    new TransformInterceptor(),
    new TimeoutInterceptor(Number(process.env.REQUEST_TIMEOUT_MS) || 30000),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // Middleware
  app.use(cookieParser());
  app.use(passport.initialize());

  const requestLogger = new RequestLoggerMiddleware(logger);
  app.use((req, res, next) => requestLogger.use(req, res, next));

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Lackey API')
      .setDescription('Lackey E-commerce API Documentation')
      .setVersion('1.0')
      .addTag('lackey')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    logger.log('Swagger documentation available at /api/docs', 'Bootstrap');
  }

  // Start server
  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server running on http://localhost:${port}`, 'Bootstrap');
  logger.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`, 'Bootstrap');
  logger.log(`🌐 API Base URL: http://localhost:${port}/api/v1`, 'Bootstrap');
}

bootstrap();
