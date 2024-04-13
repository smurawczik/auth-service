import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [
      `http://localhost:${configService.get<number>('USER_SERVICE_PORT') ?? 3005}`,
    ],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
