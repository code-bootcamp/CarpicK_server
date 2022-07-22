import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import { AppLocalModule } from './appLocal.module';
import { HttpExcptionFilter } from './commons/filter/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppLocalModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExcptionFilter());
  app.use(graphqlUploadExpress());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
