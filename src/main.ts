import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // Indirizzo del frontend
    credentials: true, // Se stai utilizzando i cookie, assicurati che questo sia true
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Permetti i metodi necessari
    allowedHeaders: ['Content-Type', 'Authorization'], // Permetti gli headers necessari
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
