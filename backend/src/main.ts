/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Allow CORS for your Next.js frontend
  app.enableCors({
    origin: ['http://localhost:3000','http://192.168.0.112:3000'], // allow only your frontend
    credentials: true, // optional, for cookies/auth
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
