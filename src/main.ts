import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api/school/v1');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.enableCors({
    origin: 'http://localhost:4200',  // Origen permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Métodos permitidos
    credentials: true,  // Si deseas permitir el uso de cookies
    allowedHeaders: 'Content-Type, Authorization, x-token',  // Encabezados permitidos
  });

  // TODO: Documnet Builder
  await app.listen(process.env.PORT);
  logger.log(`App running on port ${ process.env.PORT }`)

}
bootstrap();
